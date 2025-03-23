// server/routes/activities.js
import express from 'express';
import Client from '../models/client.js'; // Use Client model instead of Activity

const router = express.Router();

// Get client activity logs with optional filters
router.get('/', async (req, res) => {
  try {
    const { clientId, startDate, endDate } = req.query; // Changed userId to clientId

    const query = {};
    if (clientId) query._id = clientId; // Exact match for client ID
    if (startDate || endDate) {
      query.$or = [
        { lastLogin: {} },
        { createdAt: {} },
      ];
      if (startDate) {
        query.$or[0].lastLogin.$gte = new Date(startDate);
        query.$or[1].createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.$or[0].lastLogin.$lte = new Date(endDate);
        query.$or[1].createdAt.$lte = new Date(endDate);
      }
    }

    const clients = await Client.find(query).sort({ lastLogin: -1, createdAt: -1 });

    const activities = clients.map((client, index) => ({
      _id: `${client._id}-${index}`,
      clientId: client._id, // Changed from userId to clientId
      username: client.username,
      action: client.lastLogin ? 'logged in' : 'signed up',
      timestamp: client.lastLogin || client.createdAt,
    }));

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client activities', details: error.message });
  }
});

export default router;