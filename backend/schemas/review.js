import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  content: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
