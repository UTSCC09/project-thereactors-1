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

export const userInputSchema = `
  input CreateUserInput {
    firstName: String
    lastName: String
    nickname: String
    email: String
    username: String
    password: String
    profileLink: String
  }
`;

export const userQuerySchemas = `
  getUsers(id: ID): [User]
`;

export const userMutationSchemas = `
  createUser(user: CreateUserInput): User
`