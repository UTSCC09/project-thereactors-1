import mongoose from 'mongoose';

export const messageSchema = new mongoose.Schema({
  content: String,
  // party:{type: mongoose.Schema.Types.ObjectId, ref: 'Party'},
  // sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  party: String,
  sender: String,
  createdAt: { type: Date, default: Date.now },
});
