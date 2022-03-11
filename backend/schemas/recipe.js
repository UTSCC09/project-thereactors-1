import mongoose from "mongoose";

export const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pictures: [{ type: String }],
  steps: [{ type: String }],
  ingredients: [{ description: String, quantity: Number }],
  servings: Number,
  cookingTime: { hours: Number, mins: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
