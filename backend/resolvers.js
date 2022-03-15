import { GraphQLDateTime } from 'graphql-iso-date';
import {
  userQueryResolvers,
  userMutationResolvers,
  userSignInResolvers
} from './graphql/user/user_resolvers';
import {
  partyQueryResolvers,
  partyMutationResolvers,
} from './graphql/party/party_resolvers';

/**
 * GraphQL Resolvers
 **/
export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    ...userQueryResolvers,
    ...partyQueryResolvers,
    ...userSignInResolvers,
  },
  Mutation: {
    ...userMutationResolvers,
    ...partyMutationResolvers,
  },
};
