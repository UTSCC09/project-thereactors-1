// Server
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { getConfig } from './config';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import path from 'path';
// GraphQL
import { graphqlHTTP } from 'express-graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
// const helmet = require('helmet')

// SocketIO
import { Server } from 'socket.io';
import { setupSocketHandlers } from './socket_handlers';

import { authUser, signJwt, verifyJwt, isUniqueUser } from './utils';
import { User } from './db';

async function startServer() {
  // Express server
  const app = express();
  // app.use(helmet())
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: getConfig("frontendUrl") }));
  app.use('/graphql', graphqlHTTP({ graphiql: true }));
  app.post("/api/signin", body("username").trim().escape(), (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input", errors: validationErrors });
    }
    authUser(req.body.username, req.body.password, (valid, user) => {
      if (valid) {
        // If validated, return a cookie with the token stored
        const token = signJwt({ username: user.username });
        res.cookie('token', token, {
          maxAge: getConfig("cookieMaxAge"),
          httpOnly: true,
        });
        return res.json({ username: user.username, token });
      }
      else {
        return res.status(401).json({ message: "Authentication failed" });
      }
    });
  });
  app.post('/api/signout',(req,res)=> {
    res.clearCookie('token');
    return res.json("logout");
  });
  app.post("/api/signup",
    body("email").isEmail().normalizeEmail(),
    body("username").trim().escape(),
    body("password").isLength({ min: 8 }),
    (req, res) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ message: "Invalid input", errors: validationErrors });
      }
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      isUniqueUser(req.body.username, req.body.email, (isUnique, error) => {
        if (!isUnique) {
          return res.status(400).json({ message: error });
        } else {
          // Hash the given password, create a user and sign a token
          bcrypt.genSalt(getConfig("passwordSaltRounds"), (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) return res.status(500).json({ message: err });
              User.create({ username, email, password: hash }, (err, user) => {
                if (err) return res.status(500).json({ message: err });
                const token = signJwt({ username: user.username });
                res.cookie('token', token, {
                  maxAge: getConfig("cookieMaxAge"),
                  httpOnly: true,
                  // sameSite:true, // only for prod
                });
                return res.json({ username: user.username, token });
              });
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
  const httpServer = app.listen(process.env.PORT || getConfig("port"), function() {
    console.log(`Http serving at port ${process.env.PORT || getConfig("port")}`);
  });
  const io = new Server(httpServer, {
    cors: {
      origin: getConfig("frontendUrl"),
      credentials: true,
      methods: ["GET", "POST"]
    }
  });
  setupSocketHandlers(io);

  // For serving the frontend statically, in the production environment
  if (process.env.NODE_ENV === "production") {
    const FRONTEND_BUILD_PATH = "../../frontend/build";
    app.use(express.static(path.resolve(__dirname, FRONTEND_BUILD_PATH)));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, FRONTEND_BUILD_PATH, 'index.html'));
    });
  }
}
startServer();
