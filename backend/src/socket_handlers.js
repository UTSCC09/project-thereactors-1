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
    socket.data.userid // user id in the db
    */
    console.log("connection");
    if (socket.handshake.headers.cookie) {
      let res = verifyJwt(getCookie("token", socket.handshake.headers.cookie));
      if (res.valid) {
        socket.data.user = res.decoded.username;
        console.log(socket.data.user + " signed in");
      }
    }

    socket.on("disconnecting", () => {
      console.log(socket.data.user + " disconnected");
      removeConnectedUser(
        socket.data.user,
        socket.data.current_party,
        (users) => {
          io.to(socket.data.current_party).emit("user-left", users);
          console.log("removed connected user");
          updateHostClosestOrClose(
            socket.data.user,
            socket.data.current_party,
            (err, host) => {
              if (host) {
                io.to(socket.data.current_party).emit("host", host);
              }
            }
          );
        }
      );
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

    socket.on("join-room", (roomdata) => {
      try {
      const roomName = validator.escape(roomdata.roomname);
      console.log(socket.data.user + " attempts to join " + roomName);
      console.log("current party " + socket.data.current_party);
      // how to make sure that the user leaves other rooms
      if (socket.data.user && roomName) {
        // do real sanitization on these fields
        checkUserInvited(socket.data.user, roomName, (err, res) => {
          if (res) {
            console.log(socket.data.user + " joins room " + roomName);

            socket.join(roomName);
            console.log(socket.data.current_party);

            if (socket.data.current_party) {
              removeConnectedUser(
                socket.data.user,
                socket.data.current_party,
                (users) => {
                  io.to(socket.data.current_party).emit("user-left", users);
                  socket.leave(socket.data.current_party);
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
                      leaveConnectedUsers(io, socket, roomdata);
                    }
                  );
                }
              );
            } else {
              leaveConnectedUsers(io, socket, roomdata);
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
    // video socket handling
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
    socket.on("play-video", () => {
      playVideo(socket.data.current_party, socket.data.user, (err, res) => {
        if (res) {
          io.to(socket.data.current_party).emit("update-progress", res);
          console.log("play-video");
        }
      });
    });
    socket.on("update-video-progress", (playedSeconds) => {
      updateVideoProgress(
        playedSeconds,
        socket.data.current_party,
        socket.data.user,
        (err, res) => {
          if (res) {
            console.log("update-progress");
            io.to(socket.data.current_party).emit("update-progress", res);
          }
        }
      );
    });
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
          console.log(io.sockets.adapter.rooms[socket.data.voice_party]);
          // send user the current usernames in the call
          socket.emit('user-id-map',io.sockets.adapter.rooms[socket.data.voice_party]);
          socket.join(socket.data.voice_party);
          io.to(socket.data.voice_party).emit('voice-joiner', socket.data.voiceid, socket.data.user);
          console.log(socket.data.user + " joining with id " + socket.data.voiceid )

        }
      });
    });
    socket.on("leave-call",() => {
      if(socket.data.voice_party)
        socket.leave(socket.data.voice_party);
      // notify others of the change in users in the call
      if(io.sockets.adapter.rooms[socket.data.voice_party]) {
        let i = io.sockets.adapter.rooms[socket.data.voice_party].findIndex(x=>x.user === socket.data.user);
        // remove from the list of connected users
        if (i > -1) {
          io.sockets.adapter.rooms[socket.data.voice_party].splice(i, 1); 
        }
        io.to(socket.data.voice_party).emit('voice-leaver', socket.data.userid);
        console.log(socket.data.user + " left call" )
      }
      socket.data.voice_party = null;
    } );

  });
}

const leaveConnectedUsers = (io, socket, roomdata) => {
  const safeRoomName = validator.escape(roomdata.roomname);
  socket.data.current_party = safeRoomName;
  addConnectedUser(socket.data.user, safeRoomName, () => {
    io.to(safeRoomName).emit("new-joiner", socket.data.user);
    sendPrevPartyMessages(safeRoomName, (err, messages) => {
      socket.emit("joined", messages);
    });
    console.log("here");
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