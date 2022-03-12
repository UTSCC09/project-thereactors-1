import { User, Recipe, Review } from './db';
import { GraphQLDateTime } from 'graphql-iso-date';

/**
 * GraphQL Resolvers
 **/

export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
     getRecipes: (_, args) => {
      return new Promise((resolve, reject) => {
        // Find by ID
        if (args.id) {
          Recipe.findById(args.id, (err, recipe) => {
            if (err) reject(err);
            else resolve([recipe]);
          });
        }
        // Find all
        else {
          Recipe.find({}, (err, recipes) => {
            if (err) reject(err);
            else resolve(recipes);
          });
        }
      });
    },
    getUsers: (_, args) => {
      return new Promise((resolve, reject) => {
        // Find by ID
        if (args.id) {
          User.findById(args.id, (err, user) => {
            if (err) reject(err);
            else resolve([user]);
          });
        }
        // Find all
        else {
          User.find({}, (err, users) => {
            if (err) reject(err);
            else resolve(users);
          });
        }
      });
    },
    getReviews: (_, args) => {
      return new Promise((resolve, reject) => {
        // Find by ID
        if (args.id) {
          Review.findById(args.id, (err, review) => {
            if (err) reject(err);
            else resolve([review]);
          });
        }
        // Find all
        else {
          Review.find({}, (err, reviews) => {
            if (err) reject(err);
            else resolve(reviews);
          });
        }
      });
    },
  },
  Mutation: {
    createUser: (_, { user }) => {
      const newUser = new User(user);
      return new Promise((resolve, reject) => {
        newUser.save((err) => {
          if (err) reject(err);
          else resolve(newUser);
        });
      });
    },
    createRecipe: (_, { recipe }) => {
      const newRecipe = new Recipe(recipe);
      return new Promise((resolve, reject) => {
        newRecipe.save((err) => {
          if (err) reject(err);
          else resolve(newRecipe);
        });
      });
    },
    createReview: (_, { review }) => {
      const newReview = new Review(review);
      return new Promise((resolve, reject) => {
        newReview.save((err) => {
          if (err) reject(err);
          else resolve(newReview);
        })
      });
    }
  },
};
