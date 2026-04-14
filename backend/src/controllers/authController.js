const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Branch } = require('../models');

const register = async (req, res) => {
  try {
    const { username, password, role, branch_id } = req.body;
    
    // Enforcement: Branch Managers can only create employees for their branch
    if (req.user.role === 'branch_admin') {
      if (role !== 'employee') {
        return res.status(403).json({ message: 'Managers can only provision Staff/Employee accounts' });
      }
      if (branch_id !== req.user.branch_id) {
        return res.status(403).json({ message: 'Managers can only provision accounts for their own sector' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      branch_id
    });
    res.status(201).json({ message: 'User provisioned successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ 
      where: { username },
      include: [Branch]
    });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, branch_id: user.branch_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        branch_id: user.branch_id,
        branch_name: user.Branch ? user.Branch.name : 'All'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'branch_admin') {
      where = { branch_id: req.user.branch_id };
    }
    
    const users = await User.findAll({
      where,
      include: [Branch],
      attributes: { exclude: ['password'] }
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, getUsers };
