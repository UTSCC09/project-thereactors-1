import {saveMessage} from './chatroom_util.js';
import { verifyJwt } from './utils.js';
import {Party, Message} from './db.js';

const checkUserInvited = (username,roomid, callback) =>  {
  // const query = Party.where({_id : roomid}).findOne((err,doc)=> {
  //   if(doc && doc.authenticatedUsers.includes(username) ) {
  //     callback(true);
  //   } else {
  //     callback(false);
  //   }
  // })
  callback(null,true);
}
const sendPrevPartyMessages = (roomid, callback) =>  {
  Message.where({party : roomid}).find((err,docs)=> {
    if(docs) {
      callback(null, docs);
    }
  })
}
export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    /*
    socket data fields 
    socket.data.current_party  // is the party id in the db
    socket.data.userid // user id in the db
    */
    
    console.log('a user connected ' + socket.id);
    socket.on("disconnecting", (reason) => {
      io.to(socket.data.current_party).emit('user-left',socket.data.user);
      console.log('a user disconnected');
    });
    
    socket.on('sign-in',(session) =>{
      // take session information and extract user id 
      let res = verifyJwt(session.token);
      if(res.valid) {
        socket.data.user = res.decoded.username;
        console.log(socket.data.user + " signed in");
      }
    });

    socket.on('join-room',(roomdata)=> {
      console.log("user joined "+ roomdata.roomname);
      if(socket.data.user && roomdata.roomname) // do real sanitization on these fields

        checkUserInvited(socket.data.user,roomdata.roomname,(err, res) =>{ 
          if(res) {
            console.log("user joins room " + roomdata.roomname);

            socket.join(roomdata.roomname);
            socket.data.current_party = roomdata.roomname;
            io.to(socket.data.current_party).emit('new-joiner',socket.data.user);
            sendPrevPartyMessages(roomdata.roomname,(err,messages) => {
              socket.emit('joined',messages);
            });
            
          }
        });
      

    });

    socket.on('send',(content)=> {
      console.log("a user sent a message");
      if(socket.data.current_party) {
        saveMessage(content,socket.data.user,socket.data.current_party,
          (new_message) => {
            io.to(socket.data.current_party).emit('receive',new_message);
          });
      }

    });

  });
}
