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

export const userInputSchema = `
  input UserUpdateInput {
    firstName: String
    lastName: String
    nickname: String
    email: String
    password: String
  }
`;

export const userQuerySchemas = `
  getUsers(id: ID, username: String): [User]
`;

export const userMutationSchemas = `
  updateUser(id: ID, username: String, user: UserUpdateInput): User
`;
