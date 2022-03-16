export const partySchema = `
  type Party {
    _id: ID
    title: String
    password: String
    hostedBy: ID
    ytLink: [String]
    createdAt: DateTime
    startedAt: DateTime
  }
`;

export const partyInputSchema = `
  input CreatePartyInput {
    title: String
    password: String
    hostedBy: ID
    ytLink: [String]
    startedAt: DateTime
  }
`;

export const partyQuerySchemas = `
  getParties(id: ID): [Party]
`;

export const partyMutationSchemas = `
  createParty(party: CreatePartyInput): Party
`;
