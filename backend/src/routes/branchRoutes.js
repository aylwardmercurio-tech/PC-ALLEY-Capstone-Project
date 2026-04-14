const express = require('express');
const router = express.Router();
const { Branch } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const branches = await Branch.findAll();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const { name, location, phone } = req.body;
    if (!name) return res.status(400).json({ message: 'Branch name is required' });

    const branch = await Branch.create({ name, location, phone });
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const { name, location, phone } = req.body;
    const branch = await Branch.findByPk(req.params.id);
    
    if (!branch) return res.status(404).json({ message: 'Branch not found' });

    await branch.update({ name, location, phone });
    res.json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
