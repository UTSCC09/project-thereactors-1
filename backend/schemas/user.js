import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  profile_link: String,
  created_at: { type: Date, default: Date.now },
});
