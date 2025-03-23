// server/routes/messages.js
import express from 'express';
import Message from '../models/message.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify client token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.client = decoded; // Attach decoded client data
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Send a message (client only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { clientId, username, content } = req.body;
    if (!content) return res.status(400).json({ error: 'Message content is required' });

    const message = new Message({
      clientId,
      username,
      content,
    });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
});

// Get all messages (admin only, for viewing)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

export default router;