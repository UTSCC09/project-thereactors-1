import {saveMessage} from './chatroom_util.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("disconnecting", (reason) => {
      console.log('a user disconnected');
    });
    
    

    socket.on('join-room',(roomname)=> {
      console.log("user joined "+roomname);
      socket.join(roomname);
      socket.data.current_party = roomname;

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
