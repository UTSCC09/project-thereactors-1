import "./VoiceCall.scss";
import React, { useEffect, useState } from "react";
import { getSocket } from "components/utils/socket_utils";
import Peer from "peerjs";
import { useHistory } from "react-router-dom";
import { UserAudio } from "./UserAudio";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { getConfig } from "environments";
import { Scrollbars } from "react-custom-scrollbars-2";

const renderThumbVertical = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "rgba(140, 140, 140, 0.8)",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const renderThumbHorizontal = ({ style, ...props }) => {
  const thumbStyle = {
    display: "none",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

export const CustomScrollbar = (props) => (
  <Scrollbars renderThumbHorizontal={renderThumbHorizontal} renderThumbVertical={renderThumbVertical} {...props} />
);

const peerhost = getConfig("peerhost");
const peerhostport = getConfig("peerhostport");
const mediaConstraints = { audio: true, video: false };
const securepeer = getConfig("securepeer");
const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
};
let peer;

export default function VoiceCall({ videoHeight }) {
  const [localStream, setLocalStream] = useState();
  const [userlist, setuserlist] = useState([]);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const history = useHistory();

  useEffect(() => {
    return history.listen((location) => {
      disconnectCall();
    });
  }, [history]);

  const getPeer = () => {
    if (!peer || peer.destroyed) {
      // can add options here
      peer = new Peer(undefined, {
        path: "/peerjs",
        host: peerhost,
        port: peerhostport,
        config: iceServers,
        secure: securepeer,
      });
      peer.on("open", (id) => {
        getSocket().emit("set-id", id);
      });
    }
    return peer;
  };

  const disconnectCall = () => {
    setIsInCall(false);
    getSocket().emit("leave-call");
    getPeer().destroy();
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }
    setIsMuted(false);
    setuserlist([]);
  };

  // called whenever the user clicks join room
  // should tell server that it joins room,
  // then allow the user to answer calls
  const joinRoom = () => {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
      setLocalStream(stream);
      getSocket().emit("join-call");
      setIsInCall(true);
    });
  };

  const muteAudio = () => {
    setIsMuted(true);
    localStream.getAudioTracks()[0].enabled = false;
  };

  const unmuteAudio = () => {
    setIsMuted(false);
    localStream.getAudioTracks()[0].enabled = true;
  };

  const updatestream = (arr, stream, userid) => {
    let tmp = [...arr];
    tmp = tmp.map((obj) => (obj.userid === userid ? { ...obj, stream: stream } : obj));
    // console.log(tmp);
    return tmp;
  };

  useEffect(() => {
    getSocket().off("user-id-map");
    getSocket().off("voice-leaver");
    getSocket().off("voice-joiner");
    getPeer();
    if (isInCall) {
      getPeer().off("call");
      getPeer().on("call", (call) => {
        // console.log("received call from " + call.peer);
        call.answer(localStream);
        // answer incoming stream
        call.on("stream", (stream) => {
          // console.log("received stream from " + call.peer);
          handleGetStream(stream, call.peer);
        });
      });
    }

    // this function is called when there is a socket event to add a new user to the call
    // peer calls the peerid and sends the users mediastream
    const connectToNewUser = (userId) => {
      // no self calling
      if (userId === getPeer().id) {
        return;
      }
      // the client will call the new client
      let call = getPeer().call(userId, localStream);
      if (call) {
        call.on("stream", (stream) => {
          handleGetStream(stream, userId);
        });
      } else {
        console.log("call failed");
      }
    };

    const handleGetStream = (stream, userid) => {
      let index = userlist.findIndex((obj) => obj.userid === userid);
      if (index != -1) {
        setuserlist((prev) => {
          return updatestream(prev, stream, userid);
        });
      }
    };

    // happens whenever the user joins the voice call
    // sets the list of current users in the room
    getSocket().on("user-id-map", (data, username) => {
      let tmp = data;
      let index = tmp.findIndex((obj) => obj.user === username);
      if (index != -1) {
        tmp[index].stream = localStream;
      }
      setuserlist(tmp);
    });

    // check when other users disconnect
    getSocket().on("voice-leaver", (username) => {
      // remove from list and update
      let tmp = userlist.filter((e) => {
        return e.user !== username;
      });
      setuserlist(tmp);
    });

    // set up to handle new user events
    // socket listens for new user joining the call
    // it should update the user to id mapping list
    getSocket().on("voice-joiner", (userid, username) => {
      let tmp = userlist;
      let index = tmp.findIndex((obj) => obj.user === username);
      if (index == -1) {
        tmp.push({ user: username, userid: userid, stream: "" });
      } else {
        tmp[index].userid = userid;
      }
      setuserlist(tmp);
      connectToNewUser(userid);
    });
  }, [userlist, isInCall, localStream]);

  return (
    <div className="voicecall">
      {!isInCall && <RecordVoiceOverIcon className="voicecall-btn" onClick={joinRoom} />}
      {isInCall && <ExitToAppIcon className="voicecall-btn leave-icon" onClick={disconnectCall} />}
      {!isMuted && isInCall && <MicIcon className="voicecall-btn" onClick={muteAudio} />}
      {isMuted && isInCall && <MicOffIcon className="voicecall-btn" onClick={unmuteAudio} />}
      <CustomScrollbar
        className="audiolists"
        style={{ height: videoHeight - 186 }}
        autoHide
        autoHideTimeout={500}
        autoHideDuration={200}
        color="grey"
      >
        {userlist?.length > 0 &&
          userlist.map((user) => <UserAudio key={user.user} thisUser={user} clientid={getPeer().id} />)}
      </CustomScrollbar>
    </div>
  );
}
