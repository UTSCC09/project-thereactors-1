import mongoose from "mongoose";
import config from './config.json';
import { recipeSchema } from './schemas/recipe';
import { userSchema } from './schemas/user';
import { reviewSchema } from './schemas/review';

mongoose.connect(config.mongodbUrl);

let db = mongoose.connection;
db.on('error', () => {
  console.error("Error while connecting to DB");
});

export const User = mongoose.model("User", userSchema);
export const Recipe = mongoose.model("Recipe", recipeSchema);
export const Review = mongoose.model("Review", reviewSchema);
