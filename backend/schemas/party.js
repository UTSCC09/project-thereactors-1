import mongoose from 'mongoose';

export const partySchema = new mongoose.Schema({
  password: String,
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date, default: Date.now },
  hostedBy: String,
  ytLink: { type: [String], default: [] },
  connectedUsers: { type: [String], default: [] },
  authenticatedUsers: { type: [String], default: [] },
});
