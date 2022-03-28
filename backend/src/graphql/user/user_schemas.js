export const userSchema = `
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    username: String
    nickname: String
    createdAt: DateTime
  }
`;

export const userInputSchema = ``;

export const userQuerySchemas = `
  getUsers(id: ID, username: String): [User]
`;

export const userMutationSchemas = ``;
