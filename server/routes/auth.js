// routes/auth.js
import express from 'express';
import User from '../models/user.js';    // Admin model
import Client from '../models/client.js'; // Client model
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password, role: 'admin' });
    await user.save();
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    res.status(201).json({ token, user: { _id: user._id, username, email, role: user.role } });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed', details: Object.values(error.errors).map(err => err.message) });
    if (error.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Admin signup failed', details: error.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ email, role: 'admin' });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid admin credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token, user: { _id: user._id, username: user.username, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Admin login failed', details: error.message });
  }
});

// Client Signup
router.post('/client/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const client = new Client({ username, email, password, role: 'client' });
    await client.save();
    const token = jwt.sign({ clientId: client._id, role: client.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    res.status(201).json({ token, user: { _id: client._id, username, email, role: client.role } });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed', details: Object.values(error.errors).map(err => err.message) });
    if (error.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Client signup failed', details: error.message });
  }
});

// Client Login
router.post('/client/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const client = await Client.findOne({ email, role: 'client' });
    if (!client || !(await client.comparePassword(password))) return res.status(401).json({ message: 'Invalid client credentials' });
    const token = jwt.sign({ clientId: client._id, role: client.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token, user: { _id: client._id, username: client.username, email, role: client.role } });
  } catch (error) {
    res.status(500).json({ error: 'Client login failed', details: error.message });
  }
});
export default router;