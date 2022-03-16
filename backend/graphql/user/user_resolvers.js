import { ValidationError } from 'apollo-server-express';
import { User } from '../../db';
import { signJwt } from '../../utils';

export const userQueryResolvers = {
  getUsers: (_, args) => {
    return new Promise((resolve, reject) => {
      // Find by ID
      if (args.id) {
        User.findById(args.id, (err, user) => {
          if (err) reject(err);
          else resolve([user]);
        });
      }
      // Find all
      else {
        User.find({}, (err, users) => {
          if (err) reject(err);
          else resolve(users);
        });
      }
    });
  },
}

export const userMutationResolvers = {
  createUser: (_, { user }) => {
    const newUser = new User(user);
    return new Promise((resolve, reject) => {
      newUser.save((err) => {
        if (err) reject(err);
        else resolve(newUser);
      });
    });
  },
}

export const userSignInResolvers = {
  /**
   * When username and password match, we generate a JWT and return it to
   * the frontend. The frontend then will include the JWT in the header for
   * all the requests that required authentication.
   */
  signIn: (_, args) => {
    return new Promise((resolve, reject) => {
      if (args.username && args.password) {
        User.findOne({ username: args.username, password: args.password }, (err, user) => {
          if (err) {
            reject(err);
          }
          else if (!user) {
            reject(new ValidationError("Authentication failed"));
          }
          else {
            const jwt = signJwt({ username: user.username, _id: user.id, nickname: user.nickname });
            resolve({
              _id: user._id,
              username: user.username,
              email: user.email,
              token: jwt,
            });
          }
        });
      }
    });
  },
}
