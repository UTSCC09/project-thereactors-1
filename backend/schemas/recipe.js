import mongoose from "mongoose";

export const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pictures: [{ type: String }],
  steps: [{ type: String }],
  ingredients: [{ type: String }],
  tools: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
