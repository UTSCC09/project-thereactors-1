import jwt from 'jsonwebtoken';
import config from './config.json';

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
