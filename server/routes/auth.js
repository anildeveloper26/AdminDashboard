import express from 'express';
import User from '../models/user.js';    // Admin model
import Client from '../models/client.js'; // Client model
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Middleware to verify JWT and role
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Middleware to check client role
const requireClient = (req, res, next) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Client access required' });
  }
  next();
};

// Admin Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const user = new User({ username, email, password, role: 'admin' });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    res.status(201).json({
      token,
      user: { _id: user._id, username, email, role: user.role },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message),
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Admin signup failed', details: error.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email, role: 'admin' });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    user.lastLogin = new Date(); // Update last login
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token,
      user: { _id: user._id, username: user.username, email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Admin login failed', details: error.message });
  }
});

// Client Signup
router.post('/client/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const client = new Client({ username, email, password, role: 'client' });
    await client.save();
    const token = jwt.sign(
      { clientId: client._id, role: client.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    res.status(201).json({
      token,
      user: { _id: client._id, username, email, role: client.role },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message),
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Client signup failed', details: error.message });
  }
});

// Client Login
router.post('/client/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const client = await Client.findOne({ email, role: 'client' });
    if (!client || !(await client.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid client credentials' });
    }
    client.lastLogin = new Date(); // Update last login
    await client.save();
    const token = jwt.sign(
      { clientId: client._id, role: client.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token,
      user: { _id: client._id, username: client.username, email, role: client.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Client login failed', details: error.message });
  }
});

// Example Protected Route: Verify Admin Token
router.get('/admin/verify', verifyToken, requireAdmin, (req, res) => {
  res.status(200).json({ message: 'Admin token verified', user: req.user });
});

// Example Protected Route: Verify Client Token
router.get('/client/verify', verifyToken, requireClient, (req, res) => {
  res.status(200).json({ message: 'Client token verified', user: req.user });
});

export default router;