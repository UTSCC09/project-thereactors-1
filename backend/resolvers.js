import { User, Recipe } from './db';
import { GraphQLDateTime } from 'graphql-iso-date';

/**
 * GraphQL Resolvers
 **/

export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    getAllRecipes: (_) => {
      return new Promise((resolve, reject) => {
        Recipe.find((err, recipes) => {
          if (err) {
            reject(err);
          } else {
            resolve(recipes);
          }
        });
      });
    },
    getRecipeById: (_, { id }) => {
      return new Promise((resolve, reject) => {
        Recipe.findOne({ _id: id }, (err, recipe) => {
          if (err) {
            reject(err);
          } else {
            resolve(recipe);
          }
        });
      });
    },
  },
  Mutation: {
    createUser: (root, { user }) => {
      const newUser = new User({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        username: user.username,
        password: user.password,
        profile_link: user.profileLink,
      });
      return new Promise((resolve, reject) => {
        newUser.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(newUser);
          }
        });
      });
    },
    createRecipe: (root, { recipe }) => {
      const newRecipe = new Recipe({
        title: recipe.title,
        description: recipe.description,
        created_by: recipe.createdBy,
        pictures: recipe.pictures,
        steps: recipe.steps,
        ingredients: recipe.ingredients,
        tools: recipe.tools,
      });
      return new Promise((resolve, reject) => {
        newRecipe.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(newRecipe);
          }
        });
      });
    },
  },
};
