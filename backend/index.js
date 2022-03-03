// Server
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config.json';

// GraphQL
import { graphqlHTTP } from 'express-graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';

async function startServer() {
  const apollo = new ApolloServer({ typeDefs, resolvers });
  const app = express();
  await apollo.start();
  apollo.applyMiddleware({ app });
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use('/graphql', graphqlHTTP({
    graphiql: true,
  }));

  app.listen(config.port, function() {
    console.log(`Http serving at port ${config.port}`);
  });
}
startServer();
