import { User } from '../../db';

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
  signIn: (_, args) => {
    return new Promise((resolve, reject) => {
      if (args.username && args.password) {
        User.findOne({username: args.username, password: args.password}, (err, user) => {
          if (err) reject(err);
          else resolve([user]);
        });
      }
    });
  },
}
