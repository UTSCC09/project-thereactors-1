import mongoose from "mongoose";
import config from './config.json';
import { userSchema } from './schemas/user';
import { partySchema } from './schemas/party';

mongoose.connect(config.mongodbUrl);

let db = mongoose.connection;
db.on('error', () => {
  console.error("Error while connecting to DB");
});

export const User = mongoose.model("User", userSchema);
export const Party = mongoose.model("Party", partySchema);
