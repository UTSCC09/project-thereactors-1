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

export const partyMutationResolvers = {
  createParty: (_, { party }) => {
    const newParty = new Party(party);
    return new Promise((resolve, reject) => {
      newParty.save((err) => {
        if (err) reject(err);
        else resolve(newParty);
      });
    });
  },
}
