import mongoose, { Schema } from 'mongoose';

export const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nickname: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  avatar: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});
