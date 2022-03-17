export const partySchema = `
  type Party {
    _id: ID
    password: String
    hostedBy: String
    ytLink: [String]
    createdAt: DateTime
    startedAt: DateTime
    connectedUsers:[String]
    authenticatedUsers: [String]
  }
`;

export const partyInputSchema = `
  input CreatePartyInput {
    password: String
    hostedBy: String
    ytLink: [String]
    startedAt: DateTime
    connectedUsers:[String]
    authenticatedUsers: [String]
  }
`;

export const partyQuerySchemas = `
  getParties(id: ID): [Party]
`;

export const partyMutationSchemas = `
  createParty(party: CreatePartyInput): Party
`;

export const partySignInResolvers = `
joinParty(_id: String, password: String): UserSignInRespone
`;