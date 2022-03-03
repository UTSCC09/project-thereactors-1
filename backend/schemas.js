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

  type Recipe {
    _id: ID
    title: String
    description: String
    createdBy: ID
    pictures: [String]
    steps: [String]
    ingredients: [String]
    tools: [String]
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

  input CreateRecipeInput {
    title: String
    description: String
    createdBy: ID
    pictures: [String]
    steps: [String]
    ingredients: [String]
    tools: [String]
  }

  type Query {
    getAllRecipes: [Recipe]
    getRecipeById(id: ID): Recipe
  }

  type Mutation {
    createUser(user: CreateUserInput): User
    createRecipe(recipe: CreateRecipeInput): Recipe
  }
`;
