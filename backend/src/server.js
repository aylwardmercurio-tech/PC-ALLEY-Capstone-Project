const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./db');
const models = require('./models'); // Ensure models are loaded and associated

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('PC Alley API is running...');
});

// Database Sync and Start Server
sequelize.sync({ force: false })
  .then(() => {
    console.log('--------------------------------------------------');
    console.log('✅ DATABASE: Synced successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 SERVER: Running on http://localhost:${PORT}`);
      console.log('--------------------------------------------------');
    });
  })
  .catch(err => {
    console.log('--------------------------------------------------');
    console.log('❌ DATABASE ERROR: Could not connect to MySQL.');
    console.log('👉 Tip: Please ensure XAMPP is open and MySQL is STARTED.');
    console.log('--------------------------------------------------');
    console.error('Technical Details:', err.message);
  });
