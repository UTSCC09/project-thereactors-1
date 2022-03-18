// Server
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config.json';
import cors from 'cors';
import bcrypt from 'bcrypt';

// GraphQL
import { graphqlHTTP } from 'express-graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';

// SocketIO
import { Server } from 'socket.io';
import { setupSocketHandlers } from './socket_handlers';

import { authUser, signJwt, verifyJwt, isUniqueUser } from './utils';
import { User } from './db';

async function startServer() {
  // Express server
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  app.use('/graphql', graphqlHTTP({ graphiql: true }));
  app.post("/api/signin", (req, res) => {
    authUser(req.body.username, req.body.password, (valid, user) => {
      if (valid) {
        // If validated, return a cookie with the token stored
        const token = signJwt({ username: user.username });
        res.cookie('token', token, {
          maxAge: config.cookieMaxAge,
          httpOnly: true,
        });
        return res.json({ username: user.username, token });
      }
      else {
        return res.status(401).json({ message: "Authentication failed" });
      }
    });
  });
  app.post("/api/signup", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    isUniqueUser(req.body.username, req.body.email, (isUnique, error) => {
      if (!isUnique) {
        return res.status(400).json({ message: error });
      } else {
        // Hash the given password, create a user and sign a token
        bcrypt.hash(password, config.passwordSaltRounds, (err, hash) => {
          if (err) return res.status(500).json({ message: err });
          User.create({ username, email, password: hash }, (err, user) => {
            if (err) return res.status(500).json({ message: err });
            const token = signJwt({ username: user.username });
            res.cookie('token', token, {
              maxAge: config.cookieMaxAge,
              httpOnly: true,
            });
            return res.json({ usenrame: user.username, token });
          });
        });
      }
    });
  });

  // Apollo Server
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.cookies['token'] || ''
      const { valid, decoded } = verifyJwt(token);
      if (valid) {
        return { userData: decoded };
      } else {
        throw new AuthenticationError('Authentication failed');
      }
    },
  });
  await apollo.start();
  apollo.applyMiddleware({ app, path: '/api/graphql', cors: false });

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
