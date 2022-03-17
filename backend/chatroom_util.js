import {Message,User} from './db.js';


export async function saveMessage(content,sender,party,callback) {
    console.log(sender);
    let new_message = new Message({content, party,sender});
    new_message = await new_message.save();
    callback(new_message);
}

export function createTempUser(nickname,callback) {
    let new_tmp_user = new User({})
}