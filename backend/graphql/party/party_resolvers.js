import { ValidationError } from 'apollo-server-express';
import { Party } from '../../db';
import * as auth from '../../utils.js';

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
  /**
   * When username and password match, we generate a JWT and return it to
   * the frontend. The frontend then will include the JWT in the header for
   * all the requests that required authentication.
   */
   joinParty: (_, args) => {
    return new Promise((resolve, reject) => {
      if (args._id && args.password) {
        Party.findOne({ _id: args._id, password: args.password }, (err, party) => {
          if (err) {
            reject(err);
          }
          else if (!party) {
            reject(new ValidationError("Authentication failed"));
          }
          else {
            resolve({
              _id: party._id,
            });
          }
        });
      }
    });
  },
}


export const partyMutationResolvers = {
  createParty: (_, { party }) => {
    console.log(party);
    const jwt = auth.verifyJwt(party.hostedBy);
    if(jwt.valid) {
      party.hostedBy = jwt.decoded.username;
      party.authenticatedUsers = [jwt.decoded.username];
    }

    const newParty = new Party(party);
    console.log(newParty);
    return new Promise((resolve, reject) => {
      newParty.save((err) => {
        if (err) reject(err);
        else resolve(newParty);
      });
    });
  },
}
