// Server
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config.json';
import cors from 'cors';

// GraphQL
import { graphqlHTTP } from 'express-graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';

// SocketIO
import { Server } from 'socket.io';
import { setupSocketHandlers } from './socket_handlers';

async function startServer() {
  // Express server
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/graphql', graphqlHTTP({ graphiql: true }));

  // Apollo Server
  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();
  apollo.applyMiddleware({ app, path: '/api/graphql' });

  // SocketIO
  const httpServer = app.listen(config.port, function() {
    console.log(`Http serving at port ${config.port}`);
  });
  const io = new Server(httpServer, {
    cors: {
      origin: `*`,
      methods: ["GET", "POST"]
    }
  });
  setupSocketHandlers(io);
}
startServer();
