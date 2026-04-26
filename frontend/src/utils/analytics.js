// Utility functions for processing dashboard analytics

/**
 * Limit data to a certain amount of recent records to prevent UI lag.
 */
export const limitData = (data, maxRecords = 1000) => {
  if (!data || !Array.isArray(data)) return [];
  // Assuming data is sorted newest first, or we want the most recent
  return data.slice(0, Math.min(data.length, maxRecords));
};

/**
 * Extract Key Performance Indicators (KPIs)
 */
export const getKPIs = (salesHistory, inventory) => {
  const totalOrders = salesHistory.length;
  let totalRevenue = 0;
  let totalProfit = 0; // Using estimated 30% margin if cost isn't in DB
  const uniqueCustomers = new Set();
  
  salesHistory.forEach(order => {
    const amount = parseFloat(order.total_amount) || 0;
    totalRevenue += amount;
    totalProfit += (amount * 0.30); 
    if (order.customer_name) uniqueCustomers.add(order.customer_name);
  });

  const lowStockThreshold = 10;
  const lowStockCount = inventory.filter(item => item.quantity <= (item.low_stock_threshold || lowStockThreshold)).length;

  return {
    revenue: totalRevenue,
    profit: totalProfit,
    orders: totalOrders,
    customers: uniqueCustomers.size,
    lowStock: lowStockCount
  };
};

/**
 * Process monthly trend data (Revenue & Profit)
 */
export const getTrendData = (salesHistory) => {
  const revenueByMonth = new Array(12).fill(0);
  const profitByMonth = new Array(12).fill(0);
  const ordersByMonth = new Array(12).fill(0);

  salesHistory.forEach(order => {
    const month = new Date(order.createdAt).getMonth();
    const amount = parseFloat(order.total_amount) || 0;
    revenueByMonth[month] += amount;
    profitByMonth[month] += (amount * 0.30); // Simulated 30% margin
    ordersByMonth[month] += 1;
  });

  return { revenueByMonth, profitByMonth, ordersByMonth };
};

/**
 * Calculate Product Burn Rate (Days Remaining)
 * Compares 30-day velocity with current stock.
 */
export const getBurnRates = (salesHistory, inventory) => {
  // 1. Calculate sales velocity per product
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const productVelocity = {}; // product_id -> units sold in last 30 days
  
  salesHistory.forEach(order => {
    const orderDate = new Date(order.createdAt);
    if (orderDate >= thirtyDaysAgo && order.OrderItems) {
      order.OrderItems.forEach(item => {
        const pId = item.product_id;
        productVelocity[pId] = (productVelocity[pId] || 0) + item.quantity;
      });
    }
  });

  // 2. Assess burn rate against inventory
  const burnRates = [];
  
  inventory.forEach(item => {
    const stock = item.quantity;
    const velocity30 = productVelocity[item.product_id] || 0;
    const dailyVelocity = velocity30 / 30;
    
    if (dailyVelocity > 0) {
      const daysRemaining = Math.max(0, Math.ceil(stock / dailyVelocity));
      let status = 'safe';
      if (daysRemaining <= 5) status = 'critical';
      else if (daysRemaining <= 10) status = 'warning';
      
      burnRates.push({
        id: item.product_id,
        name: item.Product?.name || 'Unknown Product',
        stock,
        dailyVelocity: dailyVelocity.toFixed(1),
        daysRemaining,
        status
      });
    }
  });

  // Sort by days remaining (lowest first)
  return burnRates.sort((a, b) => a.daysRemaining - b.daysRemaining).slice(0, 5);
};

/**
 * Compute Cross-Selling Correlation Matrix
 * Returns Data for Horizontal Bar Graph
 */
export const getCrossSellCorrelations = (salesHistory) => {
  const basketPairs = {};
  let validBaskets = 0;

  salesHistory.forEach(order => {
    if (order.OrderItems && order.OrderItems.length > 1) {
      validBaskets++;
      // Extract unique categories in this order
      const catsInOrder = Array.from(new Set(
        order.OrderItems.map(item => item.Product?.Category?.name).filter(Boolean)
      ));
      
      // Generate pairs
      for (let i = 0; i < catsInOrder.length; i++) {
        for (let j = i + 1; j < catsInOrder.length; j++) {
          const pair = [catsInOrder[i], catsInOrder[j]].sort().join(' + ');
          basketPairs[pair] = (basketPairs[pair] || 0) + 1;
        }
      }
    }
  });

  const sortedPairs = Object.entries(basketPairs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 correlations

  return sortedPairs.map(([pair, count]) => ({
    pair,
    count,
    percentage: Math.round((count / validBaskets) * 100) || 0
  }));
};

/**
 * Advanced Business Logic: Product Performance & Inventory Health
 */
export const getProductPerformance = (salesHistory, inventory, correlations) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const productSales = {}; 
  const productLastSold = {};

  salesHistory.forEach(order => {
    const orderDate = new Date(order.createdAt);
    if (order.OrderItems) {
      order.OrderItems.forEach(item => {
        const pId = item.product_id;
        if (!productSales[pId]) productSales[pId] = { sold30: 0, sold7: 0 };
        
        // Track last sold date for dead stock aging
        if (!productLastSold[pId] || orderDate > productLastSold[pId]) {
          productLastSold[pId] = orderDate;
        }

        if (orderDate >= thirtyDaysAgo) {
          productSales[pId].sold30 += item.quantity;
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          if (orderDate >= sevenDaysAgo) productSales[pId].sold7 += item.quantity;
        }
      });
    }
  });

  // Calculate Star Products Context
  const starProducts = Object.entries(productSales)
    .map(([pId, data]) => {
      const product = inventory.find(i => String(i.product_id) === String(pId))?.Product;
      const name = product?.name || 'Unknown';
      const cat = product?.Category?.name || '';
      
      const dailyVelocity = (data.sold30 / 30).toFixed(1);
      const weeklyTrend = data.sold7 > (data.sold30 / 4) ? '↑ Trending Up' : '↓ Cooling';
      
      // Inject Correlation Insight if applicable
      let insight = 'High velocity baseline.';
      const relatedCorr = correlations?.find(c => c.pair.includes(cat));
      if (relatedCorr && relatedCorr.percentage > 30) {
         insight = `High demand bundled with ${relatedCorr.pair.replace(cat, '').replace('+', '').trim()} (${relatedCorr.percentage}%).`;
      }

      return { name, sold: data.sold30, dailyVelocity, weeklyTrend, insight };
    })
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3);

  // Advanced Dead Stock Logic with Safeguards & Tiers
  const deadStock = inventory
    .filter(item => {
      const sold = productSales[item.product_id]?.sold30 || 0;
      const productAgeDays = (today - new Date(item.Product?.createdAt || today)) / (1000 * 60 * 60 * 24);
      // Safeguard: Exclude new products < 30 days old
      return sold === 0 && item.quantity > 0 && productAgeDays >= 30;
    })
    .map(item => {
      const lastSoldDate = productLastSold[item.product_id];
      const daysStagnant = lastSoldDate ? Math.floor((today - lastSoldDate) / (1000 * 60 * 60 * 24)) : 90; // Default 90 if never sold
      
      let severity = 'Slow Moving';
      let tagColor = 'bg-yellow-500/10 text-yellow-500';
      if (daysStagnant >= 60) { severity = 'Dead Stock'; tagColor = 'bg-red-500/10 text-red-500 border-red-500/20'; }
      else if (daysStagnant >= 30) { severity = 'At Risk'; tagColor = 'bg-orange-500/10 text-orange-500'; }

      // Confidence score based on stagnation time and held capital
      const confidence = Math.min(99, 60 + (daysStagnant * 0.4));

      return {
        name: item.Product?.name || 'Unknown',
        stock: item.quantity,
        daysStagnant,
        severity,
        tagColor,
        insight: `Confidence: ${Math.round(confidence)}% based on ${daysStagnant}d static holding.`
      };
    })
    .sort((a, b) => b.daysStagnant - a.daysStagnant)
    .slice(0, 5);

  return { starProducts, deadStock };
};


