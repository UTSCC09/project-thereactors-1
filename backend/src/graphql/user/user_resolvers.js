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

export const userMutationResolvers = {}
