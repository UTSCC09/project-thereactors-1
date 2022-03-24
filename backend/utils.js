import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from './config.json';
import { User } from './db';

/**
 * Authenticate the user by searching the database.
 * If found, invoke the callback function, first arg
 * is true and second arg is the user object. If not,
 * first arg is false and second arg is null.
 */
export function authUser(username, password, callback) {
  User.findOne({ username }, (err, user) => {
    if (err || !user) {
      callback(false, null);
    } else {
      bcrypt.compare(password, user.password, (err, same) => {
        if (err || !same) {
          callback(false, null);
        } else {
          callback(true, user);
        }
      });
    }
  });
}

/**
 * Validate if the information provided match a user in the database.
 * If yes, invoke the callback with the first arg being false and the
 * second arg is the error message. If no, invoke the callback with the
 * first arg being true and the second args is an empty string.
 */
export function isUniqueUser(username, email, callback) {
  User.findOne({ username }, (err, user) => {
    if (err) {
      callback(false, "SERVER_ERROR");
    }
    else if (user) {
      callback(false, "DUPLICATE_USER");
    }
    else {
      User.findOne({ email }, (err, user) => {
        if (err) {
          callback(false, "SERVER_ERROR");
        }
        else if (user) {
          callback(false, "DUPLICATE_EMAIL");
        }
        else {
          callback(true, "");
        }
      });
    }
  });
}

export function signJwt(payload) {
  return jwt.sign(payload, config.jwtSecret);
}

export function verifyJwt(token) {
  try {
    return { valid: true, decoded: jwt.verify(token, config.jwtSecret) };
  } catch (err) {
    return { valid: false };
  }
}
