// server/routes/users.js
import express from 'express';
import User from '../models/user.js';

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
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({ username, email, password, role });
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Update username, email, and role
router.put('/:id', async (req, res) => {
  try {
    const { username, email, role } = req.body;
    if (!username || !email || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    user.username = username;
    user.email = email;
    user.role = role;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Toggle user status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle status', details: error.message });
  }
});

// Get total users (all added users)
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments(); // All users ever added
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total users', details: error.message });
  }
});

// Get active users (users with isActive: true)
router.get('/active', async (req, res) => {
  try {
    const count = await User.countDocuments({ isActive: true }); // Only active users
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active users', details: error.message });
  }
});

// Get today's logins (users who logged in today)
router.get('/today-logins', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today

    const count = await User.countDocuments({
      lastLogin: { $gte: startOfDay, $lte: endOfDay }, // Logins within today
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch today\'s logins', details: error.message });
  }
});

// Get recent activities (mocked using signups and logins)
router.get('/recent-activities', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ lastLogin: -1, createdAt: -1 }) // Prioritize recent logins, then signups
      .limit(5);

    const activities = users.map((user, index) => ({
      _id: `${user._id}-${index}`,
      userId: user._id,
      username: user.username,
      action: user.lastLogin ? 'logged in' : 'signed up',
      timestamp: user.lastLogin || user.createdAt,
    }));

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activities', details: error.message });
  }
});

export default router;