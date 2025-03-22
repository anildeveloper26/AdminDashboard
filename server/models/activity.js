// server/models/activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Could be ObjectId if referencing User
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Activity', activitySchema);