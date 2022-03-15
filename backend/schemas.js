import { gql } from "apollo-server-express";
import {
  userSchema,
  userInputSchema,
  userQuerySchemas,
  userMutationSchemas
} from './graphql/user/user_schemas';

export const typeDefs = gql`
  scalar DateTime

  ${userSchema}
  ${userInputSchema}

  type Query {
    ${userQuerySchemas}
  }

  type Mutation {
    ${userMutationSchemas}
  }
`;
