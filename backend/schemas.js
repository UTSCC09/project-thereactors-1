import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar DateTime

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    username: String
    profileLink: String
    createdAt: DateTime
  }

  type RecipeIngredient {
    description: String,
    quantity: Float,
    unit: String
  }

  type RecipeCookingTime {
    hours: Float,
    mins: Float
  }

  type Recipe {
    _id: ID
    title: String
    description: String
    createdBy: ID
    pictures: [String]
    steps: [String]
    ingredients: [RecipeIngredient]
    tools: [String]
    servings: Float
    cookingTime: RecipeCookingTime
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Review {
    _id: ID
    createdBy: ID
    recipe: ID
    content: String
    rating: Int
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateUserInput {
    firstName: String
    lastName: String
    email: String
    username: String
    password: String
    profileLink: String
  }

  input RecipeIngredientInput {
    description: String,
    quantity: Float,
    unit: String
  }

  input RecipeCookingTimeInput {
    hours: Float,
    mins: Float
  }

  input CreateRecipeInput {
    title: String
    description: String
    createdBy: ID
    pictures: [String]
    steps: [String]
    ingredients: [RecipeIngredientInput]
    tools: [String]
    servings: Float
    cookingTime: RecipeCookingTimeInput
  }

  input CreateReviewInput {
    createdBy: ID
    recipe: ID
    content: String,
    rating: Int
  }

  type Query {
    getRecipes(id: ID): [Recipe]
    getUsers(id: ID): [User]
    getReviews(id: ID): [Review]
  }

  type Mutation {
    createUser(user: CreateUserInput): User
    createRecipe(recipe: CreateRecipeInput): Recipe
    createReview(review: CreateReviewInput): Review
  }
`;
