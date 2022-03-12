import mongoose from "mongoose";

export const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pictures: [{ type: String }],
  steps: [{ type: String }],
  ingredients: [{ description: String, quantity: Number, unit: String }],
  servings: Number,
  cookingTime: { hours: Number, mins: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
