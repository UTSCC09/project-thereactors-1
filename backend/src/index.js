// Server
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { getConfig } from './config';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import validator from "validator";
import path from 'path';
import fs from 'fs';

// GraphQL
import { graphqlHTTP } from 'express-graphql';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
// const helmet = require('helmet')

// SocketIO
import { Server } from 'socket.io';
import { setupSocketHandlers } from './socket_handlers';

// peer
import {ExpressPeerServer, expressPeerServer} from 'peer';

import { authUser, signJwt, verifyJwt, isUniqueUser } from './utils';
import { User } from './db';

async function startServer() {
  // Express server
  const app = express();
  const upload = multer({ dest: 'uploads/' });
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
    upload.single('avatar'),
    (req, res) => {
      let username = req.body.username;
      let email = req.body.email;
      let password = req.body.password;
      const avatar = req.file;
      // validate email and normalize it
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid input", error: "Invalid email" });
      } else {
        email = validator.normalizeEmail(email);
      }
      // trim and escape username
      username = validator.trim(username);
      username = validator.escape(username);
      // validate password length
      if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({ message: "Invalid input", error: "Invalid password" });
      }
      // validate
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ message: "Invalid input", errors: validationErrors });
      }
      isUniqueUser(username, email, (isUnique, error) => {
        if (!isUnique) {
          return res.status(400).json({ message: error });
        } else {
          // Hash the given password, create a user and sign a token
          bcrypt.genSalt(getConfig("passwordSaltRounds"), (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) return res.status(500).json({ message: err });
              User.create({ username, email, avatar, password: hash }, (err, user) => {
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
  app.get("/api/:username/avatar", (req, res) => {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (!user) return res.status(404).json({ error: 'User not found' });
      const avatar = user.avatar;
      if (!avatar) return res.status(404).json({ error: 'Avatar not set' });
      res.setHeader('Content-Type', avatar.mimetype);
      res.sendFile(path.resolve(__dirname, '..', avatar.path));
    });
  });
  app.post("/api/avatar", upload.single('avatar'), (req, res) => {
    const token = req.cookies['token'] || '';
    const avatar = req.file;
    const { valid, decoded } = verifyJwt(token);
    if (valid) {
      if (!avatar) return res.status(400).json({ message: 'No avatar given' });
      User.findOne({ username: decoded.username }, (err, user) => {
        if (err) return res.status(500).json({ message: err });
        if (!user) return res.status(404).json({ message: 'User not found' });
        // If old avatar exists, delete it then save the new one, otherwise, just save the new one
        const oldAvatar = user.avatar;
        if (oldAvatar) {
          fs.unlink(path.resolve(__dirname, '..', oldAvatar.path), (err) => {
            if (err) return res.status(500).json({ message: err });
            user.avatar = avatar;
            user.save();
          });
        } else {
          user.avatar = avatar;
          user.save();
        }
      });
    } else {
      return res.status(401).json({ message: 'Access denied' });
    }
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

  // set up peer server to handle webrtc for audio calls
  const peerServer = ExpressPeerServer(httpServer);
  app.use('/peerjs',peerServer);

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
