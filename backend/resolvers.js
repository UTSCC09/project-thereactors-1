import { GraphQLDateTime } from 'graphql-iso-date';
import {
  userQueryResolvers,
  userMutationResolvers
} from './graphql/user/user_resolvers';

/**
 * GraphQL Resolvers
 **/
export const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    ...userQueryResolvers,
  },
  Mutation: {
    ...userMutationResolvers,
  },
};
