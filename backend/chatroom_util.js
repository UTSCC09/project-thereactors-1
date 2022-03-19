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
        let indexChanged = true;
        if(doc.current_vid < doc.ytLink.length)
            indexChanged = doc.ytLink[doc.current_vid] != playlist[doc.current_vid];
        let newIndex = doc.current_vid;
        if(indexChanged && playlist.includes(doc.ytLink[doc.current_vid])) {
            newIndex = playlist.indexOf(doc.ytLink[doc.current_vid]);
        }else if(indexChanged) {
          newIndex= doc.current_vid;
        }
        doc.ytLink = playlist;
        doc.current_vid = newIndex;
        doc.save().then( (res) => {callback(null, {playlist, "current_vid":newIndex} )});
      } 
    });
  
  }
  export const loadPartyPlaylist = (playlist,roomid,user,callback) =>  {
    const query = Party.where({_id : roomid}).findOne((err,doc)=> {
      if(doc && doc.hostedBy == user ) {
        
        doc.ytLink = playlist;
        doc.current_vid = playlist.length -1 ;
        doc.save().then( (res) => {callback(null, {playlist, "current_vid":res.current_vid} )});
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
  
export const addConnectedUser = (username,roomid,callback) =>  {
    Party.where({_id : roomid}).findOne((err,doc)=> {
      if(doc) {
        if(!doc.connectedUsers.includes(username)) {
          doc.connectedUsers.push(username);
          doc.save().then(()=>{callback()});
        }
      } else {
      }
    });
  }
  
  export const removeConnectedUser = (username,roomid, callback) =>  {
    Party.where({_id : roomid}).findOne((err,doc)=> {
      if(doc&& doc.connectedUsers) {
        doc.connectedUsers = doc.connectedUsers.filter( i => i !== username );
        let temp = doc.connectedUsers;
        doc.save();
        callback(temp);
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

export  const updateVideoProgress = (playedSeconds, roomid, username, callback) =>  {
    Party.where({_id : roomid, hostedBy:username}).findOne((err,doc)=> {
        if(doc) {
            doc.playedSeconds = playedSeconds;
            doc.save((err,doc) => {
                callback(null, { 'playedSeconds' :doc.playedSeconds, 'video_is_playing':doc.video_is_playing});
            });
        } else {
        callback(err,null);
        }
    });
}

export  const pauseVideo = (playedSeconds, roomid, username, callback) =>  {
    Party.where({_id : roomid, hostedBy:username}).findOne((err,doc)=> {
        if(doc) {
            doc.playedSeconds = playedSeconds;
            doc.video_is_playing = false;
            doc.save((err,doc) => {
                callback(null, { 'playedSeconds' :doc.playedSeconds, 'video_is_playing':doc.video_is_playing});
            });
        } else {
        callback(err,null);
        }
    });
}
  
export  const playVideo = ( roomid, username, callback) =>  {
    Party.where({_id : roomid, hostedBy:username}).findOne((err,doc)=> {
        if(doc) {
            doc.video_is_playing = true;
            doc.save((err,doc) => {
                callback(null, { 'playedSeconds' :doc.playedSeconds, 'video_is_playing':doc.video_is_playing});
            });
        } else {
        callback(err,null);
        }
    });
}

export  const updateCurrentVid = ( newIndex,roomid, username, callback) =>  {
    Party.where({_id : roomid, hostedBy:username}).findOne((err,doc)=> {
        if(doc) {
            doc.current_vid = newIndex;
            doc.playedSeconds = 0;
            doc.save().then( (res) => {callback(null, {'playlist':doc.ytLink, "current_vid":newIndex} )});
        } else {
        callback(err,null);
        }
    });
}