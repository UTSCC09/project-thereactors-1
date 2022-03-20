import mongoose from "mongoose";
import config from './config.json';
import { userSchema } from './schemas/user';
import { partySchema } from './schemas/party';
import { messageSchema } from "./schemas/messageSchema";

mongoose.connect(config.mongodbUrl);

let db = mongoose.connection;
db.on('error', (err) => {
  console.error("Error while connecting to DB" + err);
});

export const User = mongoose.model("User", userSchema);
export const Party = mongoose.model("Party", partySchema);
export const Message = mongoose.model("Message", messageSchema);
