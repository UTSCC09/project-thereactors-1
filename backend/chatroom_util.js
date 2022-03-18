import { Party, Message,User } from './db.js';
import { verifyJwt } from './utils.js';


export async function saveMessage(content,sender,party,callback) {
    let new_message = new Message({content, party,sender});
    new_message = await new_message.save();
    callback(new_message);
}

export function createTempUser(nickname,callback) {
    let new_tmp_user = new User({})
}
export function getCookie(name,cookies) {
    var arr = cookies.split(";");
    for(var i = 0; i < arr.length; i++) {
        var cookie = arr[i].split("=");
        if(name == cookie[0].trim()) {
          return decodeURIComponent(cookie[1]);
        }
    }
    return null;
}
  
export const setPartyPlaylist = (playlist,roomid,user,callback) =>  {
    const query = Party.where({_id : roomid}).findOne((err,doc)=> {
      if(doc && doc.hostedBy == user ) {
        doc.playlist = playlist;
        doc.save().then((res)=> {callback(null,playlist)});
      } 
    });
  
  }
  
export const checkUserInvited = (username,roomid, callback) =>  {
    const query = Party.where({_id : roomid}).findOne((err,doc)=> {
      if(doc && doc.authenticatedUsers.includes(username) ) {
        callback(null, true);
      } else {
        callback(true);
      }
    });
  }
  
export const addConnectedUser = (username,roomid) =>  {
    Party.where({_id : roomid}).findOne((err,doc)=> {
      if(doc) {
        if(!doc.connectedUsers.includes(username)) {
          doc.connectedUsers.push(username);
          doc.save();
        }
      } else {
      }
    });
  }
  
  export const removeConnectedUser = (username,roomid) =>  {
    Party.where({_id : roomid}).findOne((err,doc)=> {
      if(doc) {
        doc.connectedUsers = doc.connectedUsers.filter( i => i !== username );
        doc.save();
      } else {
      }
    });
  }
  
  export  const sendPrevPartyMessages = (roomid, callback) =>  {
    Message.where({party : roomid}).find((err,docs)=> {
      if(docs) {
        callback(null, docs);
      }
    });
  }
  
export  const sendPartyInfo = (roomid, callback) =>  {
    Party.where({_id : roomid}).findOne((err,doc)=> {
      if(doc) {
        callback(null, doc);
      } else {
        callback(err,null);
      }
    });
  }
  