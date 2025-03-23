import express from 'express';
import Client from '../models/client.js';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().select('-password');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients', details: error.message });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body; // Role is fixed as 'client' in model
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const client = new Client({ username, email, password }); // Role defaults to 'client'
    await client.save();
    const clientResponse = client.toObject();
    delete clientResponse.password;
    res.status(201).json(clientResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client', details: error.message });
  }
});

// Update client username and email (role is fixed as 'client')
router.put('/:id', async (req, res) => {
  try {
    const { username, email } = req.body; // No role field since it's fixed
    if (!username || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const emailExists = await Client.findOne({ email, _id: { $ne: req.params.id } });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    client.username = username;
    client.email = email;
    await client.save();

    const clientResponse = client.toObject();
    delete clientResponse.password;
    res.json(clientResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client', details: error.message });
  }
});

// Toggle client status (assuming Client model has isActive field)
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    client.isActive = !client.isActive; // Assumes isActive field exists
    await client.save();

    const clientResponse = client.toObject();
    delete clientResponse.password;
    res.json(clientResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle status', details: error.message });
  }
});

// Get total clients (all added clients)
router.get('/count', async (req, res) => {
  try {
    const count = await Client.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total clients', details: error.message });
  }
});

// Get active clients (clients with isActive: true)
router.get('/active', async (req, res) => {
  try {
    const count = await Client.countDocuments({ isActive: true });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active clients', details: error.message });
  }
});

// Get today's logins (clients who logged in today)
router.get('/today-logins', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Client.countDocuments({
      lastLogin: { $gte: startOfDay, $lte: endOfDay },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch today\'s logins', details: error.message });
  }
});

// Get recent activities (mocked using signups and logins for clients)
router.get('/recent-activities', async (req, res) => {
  try {
    const clients = await Client.find()
      .sort({ lastLogin: -1, createdAt: -1 })
      .limit(5);

    const activities = clients.map((client, index) => ({
      _id: `${client._id}-${index}`,
      clientId: client._id,
      username: client.username,
      action: client.lastLogin ? 'logged in' : 'signed up',
      timestamp: client.lastLogin || client.createdAt,
    }));

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activities', details: error.message });
  }
});

// New endpoint: Get client activity logs with optional filters (merged from activities.js)
router.get('/activities', async (req, res) => {
  try {
    const { clientId, startDate, endDate } = req.query;

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
      clientId: client._id,
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