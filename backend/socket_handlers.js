import {saveMessage} from './chatroom_util.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    /*
    socket data fields 
    socket.data.current_party  // is the party id in the db
    socket.data.userid // user id in the db

    */

    console.log('a user connected');
    socket.on("disconnecting", (reason) => {
      io.to(socket.data.current_party).emit('user-left',socket.data.userid);
      console.log('a user disconnected');
    });
    
    socket.on('sign-in',(session) =>{
      // take session information and extract user id 
    });

    socket.on('join-room',(roomname)=> {
      console.log("user joined "+roomname);
      socket.join(roomname);
      socket.data.current_party = roomname;
      io.to(socket.data.current_party).emit('new-joiner',);
    });

    socket.on('send',(content)=> {
      console.log("a user sent a message");

      saveMessage(content,socket.data.current_party,socket.data.userid,
        (new_message) => {
          io.to(socket.data.current_party).emit('receive',new_message);
        });
    });

  });
}
