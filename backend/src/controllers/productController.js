const { Product, Category, ProductBundle } = require('../models');

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        Category,
        {
          model: Product,
          as: 'BundleItems',
          through: { attributes: ['quantity'] }
        }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBundle = async (req, res) => {
  try {
    const { name, sku, price, items, category_id } = req.body;
    
    // Create the bundle product
    const bundleProduct = await Product.create({
      name,
      sku,
      price,
      is_bundle: true,
      category_id: category_id || null
    });

    // Create associations in ProductBundle table
    if (items && items.length > 0) {
      const bundleItems = items.map(item => ({
        bundle_id: bundleProduct.id,
        product_id: item.product_id,
        quantity: item.quantity
      }));
      await ProductBundle.bulkCreate(bundleItems);
    }

    res.status(201).json(bundleProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, price, category_id, description } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name) product.name = name;
    if (sku) product.sku = sku;
    if (price !== undefined) product.price = price;
    if (category_id !== undefined) product.category_id = category_id;
    if (description !== undefined) product.description = description;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getProducts, createBundle, updateProduct };
