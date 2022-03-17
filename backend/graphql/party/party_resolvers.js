import { ValidationError } from 'apollo-server-express';
import { Party } from '../../db';

export const partyQueryResolvers = {
  getParties: (_, args) => {
    return new Promise((resolve, reject) => {
      // Find by ID
      if (args.id) {
        Party.findById(args.id, (err, party) => {
          if (err) reject(err);
          else resolve([party]);
        });
      }
      // Find all
      else {
        Party.find({}, (err, parties) => {
          if (err) reject(err);
          else resolve(parties);
        });
      }
    });
  },
}

export const partySignInResolvers = {
   joinParty: (_, args, context) => {
    return new Promise((resolve, reject) => {
      const { username } = context.userData;
      if (args._id && args.password) {
        Party.findOne({ _id: args._id, password: args.password }, (err, party) => {
          if (err) {
            reject(err);
          }
          else if (!party) {
            reject(new ValidationError("Authentication failed"));
          }
          else {
            party.authenticatedUsers.push(username);
            party.save();
            resolve({ _id: party._id });
          }
        });
      }
    });
  },
}

export const partyMutationResolvers = {
  createParty: (_, { party }, context) => {
    return new Promise((resolve, reject) => {
      const { username } = context.userData;
      party.hostedBy = username;
      party.authenticatedUsers = [username];
      // Create new party
      const newParty = new Party(party);
      newParty.save((err) => {
        if (err) reject(err);
        else resolve(newParty);
      });
    });
  },
}
