import { saveMessage,createTempUser,getCookie,setPartyPlaylist,checkUserInvited,addConnectedUser,removeConnectedUser,sendPrevPartyMessages,sendPartyInfo } from './chatroom_util.js';
import { verifyJwt } from './utils.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    /*
    socket data fields
    socket.data.current_party  // is the party id in the db
    socket.data.userid // user id in the db
    */

    if(socket.handshake.headers.cookie) {
      let res = verifyJwt(getCookie('token',socket.handshake.headers.cookie));
      if(res.valid) {
        socket.data.user = res.decoded.username;
        console.log(socket.data.user + " signed in");
      }

    }
    socket.on("disconnecting", (reason) => {
      io.to(socket.data.current_party).emit('user-left',socket.data.user);
      removeConnectedUser(socket.data.user,socket.data.current_party);
      console.log( socket.data.user+' disconnected');
    });


    socket.on('join-room',(roomdata)=> {
      if(socket.data.user && roomdata.roomname) // do real sanitization on these fields
        checkUserInvited(socket.data.user,roomdata.roomname,(err, res) =>{
          if(res) {
            console.log( socket.data.user+" joins room " + roomdata.roomname);

            socket.join(roomdata.roomname);
            socket.data.current_party = roomdata.roomname;
            addConnectedUser(socket.data.user,roomdata.roomname);
            io.to(socket.data.current_party).emit('new-joiner',socket.data.user);
            sendPrevPartyMessages(roomdata.roomname,(err,messages) => {
              socket.emit('joined',messages);
            });
            sendPartyInfo(roomdata.roomname,(err,data) => {
              if(data)
                io.to(socket.data.current_party).emit('curr_users',data.connectedUsers);
                io.to(socket.data.current_party).emit('host',data.hostedBy);
            });
          }
        });
    });

    socket.on('send',(content)=> {
      if(socket.data.current_party) {
        saveMessage(content,socket.data.user,socket.data.current_party,
          (new_message) => {
            io.to(socket.data.current_party).emit('receive',new_message);
          });
      }
    });

    socket.on('update-playlist',(playlist)=> {
      setPartyPlaylist(playlist,socket.data.current_party,socket.data.user, (err,res)=>{
        if(res)
          io.to(socket.data.current_party).emit('playlist-changed',res);
      });
    });
  });
}
