// server/routes/users.js
import express from 'express';
import User from '../models/user.js'; // Corrected path

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });
    await user.save();
    const newUser = user.toObject();
    delete newUser.password;
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Toggle user status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle status', details: error.message });
  }
});

export default router;