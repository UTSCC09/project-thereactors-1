import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nickname: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  profileLink: String,
  createdAt: { type: Date, default: Date.now },
});
