export const partySchema = `
  type Party {
    _id: ID
    password: String
    hostedBy: String
    originalHost: String
    ytLink: [String]
    createdAt: DateTime
    startedAt: DateTime
    connectedUsers:[String]
    authenticatedUsers: [String]
    video_is_playing : Boolean
    playedSeconds : Int
    current_vid : Int
  }
`;

export const partyInputSchema = `
  input CreatePartyInput {
    password: String
    hostedBy: String
    originalHost: String
    ytLink: [String]
    startedAt: DateTime
    connectedUsers:[String]
    authenticatedUsers: [String]
    video_is_playing : Boolean
    playedSeconds : Int
    current_vid : Int

  }
`;

export const partyQuerySchemas = `
  getParties(id: ID): [Party]
`;

export const partyMutationSchemas = `
  createParty(party: CreatePartyInput): Party
`;

export const partySignInSchemas = `
  joinParty(_id: String, password: String): Party
`;
