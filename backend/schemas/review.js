import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  content: String,
  rating: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
