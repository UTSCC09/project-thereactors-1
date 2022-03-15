import { gql } from "apollo-server-express";
import {
  userSchema,
  userInputSchema,
  userQuerySchemas,
  userMutationSchemas,
  userSignInSchemas
} from './graphql/user/user_schemas';
import {
  partySchema,
  partyInputSchema,
  partyQuerySchemas,
  partyMutationSchemas,
} from './graphql/party/party_schemas';

export const typeDefs = gql`
  scalar DateTime

  ${userSchema}
  ${userInputSchema}

  ${partySchema}
  ${partyInputSchema}

  type Query {
    ${userQuerySchemas}
    ${partyQuerySchemas}
    ${userSignInSchemas}
  }

  type Mutation {
    ${userMutationSchemas}
    ${partyMutationSchemas}
  }
`;
