export const userSchema = `
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    username: String
    nickname: String
    profileLink: String
    createdAt: DateTime
  }
`;

export const userInputSchema = ``;

export const userQuerySchemas = `
  getUsers(id: ID): [User]
`;

export const userMutationSchemas = ``;
