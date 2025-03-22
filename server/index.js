// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Add this import
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Enable CORS for http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://anilkumarbobba2626:Anilkumar%401@cluster0.knp3r.mongodb.net/myDatabase?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));