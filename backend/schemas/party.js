import mongoose from 'mongoose';

export const partySchema = new mongoose.Schema({
  title: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date, default: Date.now },
  hostedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ytLink: String,
});
