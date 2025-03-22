// server/routes/activities.js
import express from 'express';
import Activity from '../models/activity.js';

const router = express.Router();

// Get activity logs with optional filters
// Get activity logs with optional filters
router.get('/', async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const query = {};
    if (userId) query.userId = { $regex: userId, $options: 'i' }; // Case-insensitive search
    if (startDate) query.timestamp = { $gte: new Date(startDate) };
    if (endDate) {
      query.timestamp = query.timestamp || {};
      query.timestamp.$lte = new Date(endDate);
    }

    const activities = await Activity.find(query).sort({ timestamp: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
  }
});


export default router;