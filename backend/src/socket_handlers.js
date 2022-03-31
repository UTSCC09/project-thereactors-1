import {
  saveMessage,
  getCookie,
  setPartyPlaylist,
  checkUserInvited,
  addConnectedUser,
  removeConnectedUser,
  sendPrevPartyMessages,
  sendPartyInfo,
  pauseVideo,
  playVideo,
  updateVideoProgress,
  updateCurrentVid,
  loadPartyPlaylist,
  updateHost,
  updateHostClosestOrClose,
  retrieveRemote,
} from "./chatroom_util.js";
import { verifyJwt } from "./utils.js";
import validator from "validator";
import sanitize from 'mongo-sanitize';

export function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    /*
    socket data fields
    socket.data.current_party  // is the party id in the db
    socket.data.userid // user id of the peer connection
    socket.data.voice_party // voice party id

    */
    if (socket.handshake.headers.cookie) {
      let res = verifyJwt(getCookie("token", socket.handshake.headers.cookie));
      if (res.valid) {
        socket.data.user = res.decoded.username;
        console.log(socket.data.user + " signed in");
      }
    }

    socket.on("disconnecting", () => {
      console.log(socket.data.user + " disconnected");
      let curr_party = socket.data.current_party;
      let curr_user = socket.data.user;
      let curr_voice_party = socket.data.voice_party;
      removeConnectedUser(
        curr_user,
        curr_party,
        (users) => {
          console.log("removed connected user");
          updateHostClosestOrClose(
            curr_user,
            curr_party,
            (err, host) => {
              if (host) {
                io.to(curr_party).emit("user-left", {users, host});
              } else {
                io.to(curr_party).emit("user-left", {users, host:""});
              }
            }
          );
        }
      );
      if(socket.data.current_party)
        socket.leave(curr_party);
      if(socket.data.voice_party)
        socket.leave(curr_voice_party);
      // notify others of the change in users in the call
      if(io.sockets.adapter.rooms[socket.data.voice_party]) {
        // remove from the list of connected users
        io.sockets.adapter.rooms[curr_voice_party] = io.sockets.adapter.rooms[curr_voice_party].filter((e) => {return e.user !== socket.data.user}); 
        io.to(curr_voice_party).emit('voice-leaver', curr_user);
        console.log(curr_user + " left call" )
      }
      socket.data.voice_party = null;
      // remove frome everything else
      socket.data.current_party = '';
    });


    socket.on("get-remote", () => {
      if (socket.data.current_party && socket.data.user) {
        retrieveRemote(
          socket.data.current_party,
          socket.data.user,
          (err, newhost) => {
            if (newhost) {
              io.to(socket.data.current_party).emit("host", newhost);
            }
          }
        );
      }
    });

    // this handles users joining a watch party
    socket.on("join-room", (roomdata) => {
      try {
      console.log(socket.id);
      const roomName = validator.escape(roomdata.roomname);
      console.log(socket.data.user + " attempts to join " + roomName);
      console.log("current party " + socket.data.current_party);
      
      if (socket.data.user && roomName) {
        // makes sure the user is authenticated for this room
        checkUserInvited(socket.data.user, roomName, (err, res) => {
          if (res) {
            console.log(socket.data.user + " joining room " + roomName);
            socket.join(roomName);
            // remove user from previous room
            if (socket.data.current_party && socket.data.current_party !== roomName) {
              removeConnectedUser(
                socket.data.user,
                socket.data.current_party,
                // tell current users that someone left
                (users) => {
                  io.to(socket.data.current_party).emit("user-left", {users,host:""} );
                  socket.leave(socket.data.current_party);
                  // transfer host priviledges to the nearest available, or clost hte room otherwise
                  updateHostClosestOrClose(
                    socket.data.user,
                    socket.data.current_party,
                    (err, host) => {
                      if (host) {
                        console.log(
                          "new host" + host + " in " + socket.data.current_party
                        );
                        io.to(socket.data.current_party).emit("host", host);
                      }
                      // join user to new room once cleanup is finished
                      socketJoinRoom(io, socket, roomdata);
                    }
                  );
                }
              );
            } else {
              // if didnt need to remove user from previous room, then join to new room
              socketJoinRoom(io, socket, roomdata);
            }
          }
          if (err) {
            socket.emit("password-missing");
          }
        });
      }
    }catch(err) {
      console.log(err);
    }
    });
    // sending text messages in the party chat
    socket.on("send", (content) => {
      const safeContent = sanitize(content);
      if (socket.data.current_party) {
        saveMessage(
          safeContent,
          socket.data.user,
          socket.data.current_party,
          (new_message) => {
            io.to(socket.data.current_party).emit("receive", new_message);
          }
        );
      }
    });
    // video playlist handling
    // updates the current set of videos 
    socket.on("update-playlist", (playlist) => {
      setPartyPlaylist(
        playlist,
        socket.data.current_party,
        socket.data.user,
        (err, res) => {
          if (res) {
            io.to(socket.data.current_party).emit("playlist-changed", {
              playlist: res.playlist,
              current_vid: res.current_vid,
            });
          }
        }
      );
    });

    // called when user loads a new video
    // the current video will be changed to this new video which should be appended to the end of the video list
    // signals client to update their current video and playlist
    socket.on("load-playlist", (playlist) => {
      loadPartyPlaylist(
        playlist,
        socket.data.current_party,
        socket.data.user,
        (err, res) => {
          if (res) {
            io.to(socket.data.current_party).emit("playlist-changed", {
              playlist: res.playlist,
              current_vid: res.current_vid,
            });
          }
        }
      );
    });

    // when host pauses video, tell other users to pause
    socket.on("pause-video", (playedSeconds) => {
      pauseVideo(
        playedSeconds,
        socket.data.current_party,
        socket.data.user,
        (err, res) => {
          if (res) {
            console.log("pause-video");
            io.to(socket.data.current_party).emit("update-progress", res);
          }
        }
      );
    });
    // when host plays video, tell other users to play
    socket.on("play-video", () => {
      playVideo(socket.data.current_party, socket.data.user, (err, res) => {
        if (res) {
          io.to(socket.data.current_party).emit("update-progress", res);
          console.log("play-video");
        }
      });
    });
    // called frequently by host to update the video progress so client remains in sync
    socket.on("update-video-progress", (playedSeconds) => {
      updateVideoProgress(
        playedSeconds,
        socket.data.current_party,
        socket.data.user,
        (err, res) => {
          if (res) {
            // console.log("update-progress");
            io.to(socket.data.current_party).emit("update-progress", res);
          }
        }
      );
    });
    // called by host to switch the current video in hte playlist to a new one
    socket.on("update-index", (newIndex) => {
      updateCurrentVid(
        newIndex,
        socket.data.current_party,
        socket.data.user,
        (err, res) => {
          if (res) {
            io.to(socket.data.current_party).emit("playlist-changed", {
              playlist: res.playlist,
              current_vid: res.current_vid,
            });
          }
        }
      );
    });
    // change host
    socket.on("host-change", (newUser) => {
      const safeNewUser = validator.escape(newUser);
      updateHost(
        safeNewUser,
        socket.data.current_party,
        socket.data.user,
        (err, res) => {
          if (res) io.to(socket.data.current_party).emit("host", res);
        }
      );
    });
    socket.on("emote", (emote_string) => {
      if(socket.data.current_party) {
        // generate random 
        let rand_x = Math.random();
        let rand_y = Math.random();
        io.to(socket.data.current_party).emit("emote", {"emote_code":emote_string, "x":rand_x, "y": rand_y});
      }
    });

    // VOICE CALL FUNCTIONALITY
    // set the peerjs id of the user
    socket.on('set-id',(id)=> {
      if (socket.data.user) {
        socket.data.voiceid = id;
        // console.log(socket.data.user + "'s id is " + socket.data.voiceid)
      }
    });
    socket.on("join-call", () => {
      checkUserInvited(socket.data.user, socket.data.current_party, (err, res) => {
        if (res) {
          socket.data.voice_party = socket.data.current_party+"call";
          if (!io.sockets.adapter.rooms[socket.data.voice_party]) {
            io.sockets.adapter.rooms[socket.data.voice_party] = [];
          }
          // check if user is in the call already
          let curr_user = io.sockets.adapter.rooms[socket.data.voice_party].find(x=>x.user === socket.data.user);
          if(curr_user && curr_user.userid === socket.data.voiceid) {
            return;
          }
          // add user to the list
          if(!curr_user) {
            curr_user = {user: socket.data.user, userid:socket.data.voiceid, stream:""};
            io.sockets.adapter.rooms[socket.data.voice_party].push(curr_user);
          } else {
          // update userid of curr_user
            let i = io.sockets.adapter.rooms[socket.data.voice_party].findIndex(x=>x.user === socket.data.user);
            curr_user = {user: socket.data.user, userid:socket.data.voiceid, stream:""};
            io.sockets.adapter.rooms[socket.data.voice_party][i] = curr_user;
          }
          // send user the current usernames in the call
          socket.emit('user-id-map',io.sockets.adapter.rooms[socket.data.voice_party],socket.data.user);
          socket.join(socket.data.voice_party);

          io.to(socket.data.voice_party).emit('voice-joiner', socket.data.voiceid, socket.data.user);
          console.log(socket.data.user + " joining voice with id " + socket.data.voiceid )

        }
      });
    });
    socket.on("leave-call",() => {
      if(socket.data.voice_party)
        socket.leave(socket.data.voice_party);
      // notify others of the change in users in the call
      if(io.sockets.adapter.rooms[socket.data.voice_party]) {
        // let i = io.sockets.adapter.rooms[socket.data.voice_party].findIndex(x=>x.user === socket.data.user);
        // remove from the list of connected users
        // console.log("removed");
        io.sockets.adapter.rooms[socket.data.voice_party] = io.sockets.adapter.rooms[socket.data.voice_party].filter((e) => {return e.user !== socket.data.user}); 
        io.to(socket.data.voice_party).emit('voice-leaver', socket.data.user);
        console.log(socket.data.user + " left call" )
        // console.log(io.sockets.adapter.rooms[socket.data.voice_party])
      }
      socket.data.voice_party = null;
    } );

  });
}

const socketJoinRoom = (io, socket, roomdata) => {
  const safeRoomName = validator.escape(roomdata.roomname);
  socket.data.current_party = safeRoomName;
  addConnectedUser(socket.data.user, safeRoomName, (val) => {
    if(val)
      io.to(safeRoomName).emit("new-joiner", socket.data.user);
    sendPrevPartyMessages(safeRoomName, (err, messages) => {
      socket.emit("joined", messages);
    });
    sendPartyInfo(safeRoomName, (err, data) => {
      if (data) {
        io.to(safeRoomName).emit("curr_users", data.connectedUsers);
        io.to(safeRoomName).emit("host", data.hostedBy);
        socket.emit("playlist-changed", {
          playlist: data.ytLink,
          current_vid: data.current_vid,
        });
        socket.emit("update-progress", {
          playedSeconds: data.playedSeconds,
          video_is_playing: data.video_is_playing,
        });
        socket.emit("original-host", data.originalHost);
      }
    });
  });
};
