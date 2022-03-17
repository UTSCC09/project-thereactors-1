import mongoose from 'mongoose';

export const partySchema = new mongoose.Schema({
  password: String,
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date, default: Date.now },
  hostedBy: String,
  ytLink: [String],
  connectedUsers:[String],
  authenticatedUsers: [String],
});
