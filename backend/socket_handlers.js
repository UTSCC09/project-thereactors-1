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
    });

    socket.on("send", (content) => {
      const safeContent = validator.escape(content);
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
      let safePlaylist = [];
      if (playlist) {
        playlist.forEach((item) => {
          let copyPlaylist = {};
          // Iterate through each fields of the playlist, make a deep copy
          // and escape the string
          for (let k in item) {
            copyPlaylist[k] = validator.escape(item[k]);
          }
          safePlaylist.push(copyPlaylist);
        });
      }
      setPartyPlaylist(
        safePlaylist,
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
      let safePlaylist = [];
      if (playlist) {
        playlist.forEach((item) => {
          let copyPlaylist = {};
          // Iterate through each fields of the playlist, make a deep copy
          // and escape the string
          for (let k in item) {
            copyPlaylist[k] = validator.escape(item[k]);
          }
          safePlaylist.push(copyPlaylist);
        });
      }
      loadPartyPlaylist(
        safePlaylist,
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
      // A warning here if playedSeconds is not a number
      if (!validator.isNumeric(playedSeconds)) {
        console.log(`[Socket] In pause-video handler, playedSeconds is ${playedSeconds}, expecting a number`);
      }
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
      // A warning here if playedSeconds is not a number
      if (!validator.isNumeric(playedSeconds)) {
        console.log(`[Socket] In update-video-progress handler, playedSeconds is ${playedSeconds}, expecting a number`);
      }
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
      // A warning here if playedSeconds is not a number
      if (!validator.isNumeric(newIndex)) {
        console.log(`[Socket] In pause-video handler, newIndex is ${newIndex}, expecting a number`);
      }
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
