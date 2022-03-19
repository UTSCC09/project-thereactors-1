import { saveMessage,createTempUser,getCookie,setPartyPlaylist,checkUserInvited,addConnectedUser,removeConnectedUser,sendPrevPartyMessages,sendPartyInfo 
,pauseVideo,playVideo,updateVideoProgress,updateCurrentVid} from './chatroom_util.js';
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

    socket.on("disconnecting", () => {
      console.log( socket.data.user+' disconnected');
      removeConnectedUser(socket.data.user,socket.data.current_party, (users) => {
        io.to(socket.data.current_party).emit('user-left',users);
      });
    });


    socket.on('join-room',(roomdata)=> {
      console.log(socket.data.user + " attempts to join")
      // how to make sure that the user leaves other rooms 
      if(socket.data.user && roomdata.roomname) // do real sanitization on these fields
        checkUserInvited(socket.data.user,roomdata.roomname,(err, res) =>{
          if(res) {
            console.log( socket.data.user+" joins room " + roomdata.roomname);

            socket.join(roomdata.roomname);
            socket.data.current_party = roomdata.roomname;
            
            addConnectedUser(socket.data.user,roomdata.roomname, () => {
              io.to(socket.data.current_party).emit('new-joiner',socket.data.user);
              sendPrevPartyMessages(roomdata.roomname,(err,messages) => {
                socket.emit('joined',messages);
              });
              console.log("here");
              sendPartyInfo(roomdata.roomname,(err,data) => {
                if(data)
                  io.to(socket.data.current_party).emit('curr_users',data.connectedUsers);
                  io.to(socket.data.current_party).emit('host',data.hostedBy);
                  socket.emit('playlist-changed',{'playlist':data.ytLink,'current_vid':data.current_vid});
                  socket.emit('update-progress',{ 'playedSeconds' :data.playedSeconds, 'video_is_playing':data.video_is_playing})
              });
            });
          }
          if(err) {
            socket.emit("password-missing");
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
    // video socket handling
    socket.on('update-playlist',(playlist, callback) => {
      setPartyPlaylist(playlist,socket.data.current_party,socket.data.user, (err,res)=>{
        if(res) {
          io.to(socket.data.current_party).emit('playlist-changed',{'playlist': res.playlist, 'current_vid':res.current_vid });
          callback({'playlist': res.playlist, 'current_vid':res.current_vid })
        }
      });
    });

    socket.on('pause-video',(playedSeconds)=> {
      pauseVideo(playedSeconds,socket.data.current_party,socket.data.user,(err,res)=> {
        if(res){
          console.log('pause-video');
          io.to(socket.data.current_party).emit('update-progress',res);
        }
          
      });
    });
    socket.on('play-video',()=> {
      playVideo(socket.data.current_party,socket.data.user,(err,res)=> {
        if(res) {
          io.to(socket.data.current_party).emit('update-progress',res);
          console.log('play-video');
        }
          
      });
    });
    socket.on('update-video-progress',(playedSeconds)=> {
      updateVideoProgress(playedSeconds,socket.data.current_party,socket.data.user,(err,res)=> {
        if(res) {
          console.log('update-progress');
          io.to(socket.data.current_party).emit('update-progress',res);
        }
          
      });
    });
    socket.on('update-index', (newIndex)=> {
      updateCurrentVid(newIndex,socket.data.current_party,socket.data.user,(err,res)=> {
        if(res) {
          io.to(socket.data.current_party).emit('playlist-changed',{'playlist':res.playlist, 'current_vid':res.current_vid });
        }
      });
    });
  });
}
