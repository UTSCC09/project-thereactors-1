import mongoose from 'mongoose';

export const partySchema = new mongoose.Schema({
  password: String,
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date, default: Date.now },
  hostedBy: String,
  ytLink: { type: [{ title: String, link: String, thumbnail: String }], default: [] },
  connectedUsers: { type: [String], default: [] },
  authenticatedUsers: { type: [String], default: [] },
  playedSeconds : {type: Number, default: 0},
  video_is_playing : {type: Boolean, default: false},
  current_vid : {type: Number, default: 0},
});
