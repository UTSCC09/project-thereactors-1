import { User } from '../../db';
import bcrypt from 'bcryptjs';
import { getConfig } from '../../config';
import { ValidationError } from 'apollo-server-express';

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
      // Find by username
      else if (args.username) {
        User.findOne({ username }, (err, user) => {
          if(err) reject(err);
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
  updateUser: (_, args) => {
    return new Promise((resolve, reject) => {
      // User id if possible, otherwise, use username
      let query = {};
      if (args.id) {
        query._id = args.id;
      }
      else if (args.username) {
        query.username = args.username;
      }
      User.findOne(query, (err, user) => {
        if (err) return reject(err);
        else if (!user) return reject(new ValidationError("User not found"));
        let userInput = args.user;
        // If user is updating their password, hash it
        if (userInput.password) {
          bcrypt.genSalt(getConfig("passwordSaltRounds"), (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) return res.status(500).json({ message: err });
              userInput.password = hash;
              User.updateOne(query, userInput, (err, user) => {
                if (err) return reject(err);
                resolve(user);
              });
            });
          });
        }
        else {
          User.updateOne(query, userInput, (err, user) => {
            if (err) return reject(err);
            resolve(user);
          });
        }
      });
    });
  }
}
