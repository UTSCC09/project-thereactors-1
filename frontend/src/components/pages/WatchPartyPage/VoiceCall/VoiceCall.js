import './VoiceCall.scss';
import React, { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { getSocket } from 'components/utils/socket_utils';
import { handleBreakpoints } from '@mui/system';
import Peer from 'peerjs';
import { Socket } from 'socket.io-client';
const mediaConstraints = {audio: true, video: false }
// TODO  audio analyzer on the streams to have a list of currently talking users
const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  }
let localStream;
let peer;
export default function VoiceCall() {
  const [userlist,setuserlist] = useState([]); // userlist =  [{username: string, id: string}]
  const [streamlist, setStreamList] = useState([]);
  const [isDisconnected,setIsDisconnected] = useState(true);
  const [isInCall,setIsInCall] = useState(false);
  const [isMuted,setIsMuted] = useState(false);

  getSocket().on('voice-userlist', (data) => {
    
  });

  function getPeer() {
    if(!peer || isDisconnected) {
      // can add options here
      peer = new Peer(undefined, {
        path: '/peerjs',
        host: 'localhost',
        port: '3001',
        config: iceServers,
      });
      setIsDisconnected(false);
      console.log("new peer")
    }
    return peer;
  }
  function handleNewJoiner(userid) {
    connectToNewUser(userid,localStream );
  }

  function joinRoom() {
    console.log("join-call")
    getSocket().emit('join-call');
    setIsInCall(true);
    navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream)=> {
      localStream = stream;
      answerCalls();
    });
  }
  const answerCalls = () => {
    // set up to handle webrtc call requests
    getPeer().on('call',(call) => {
      console.log("received call");
      call.answer(localStream);
      const audio = document.createElement('audio');
      audio.id = call.peer;
      // answer incoming stream
      call.on('stream',(stream) => {
        console.log("received stream from call")
        console.log(stream)
        addAudioStream(audio, stream);
      });
    });
    // set up to handle new user events
    getSocket().on('voice-joiner',(userid) => {
      handleNewJoiner(userid);
    });
  }

  const addAudioStream = (audio, stream) => {
    audio.srcObject = stream;
    audio.controls = 'controls';
    audio.addEventListener("loadedmetadata",() => {
      audio.play();
      document.querySelector("#audiolists").append(audio);
    });
  }

  // this function is called when there is a socket event to add a new user to the call
  const connectToNewUser =  (userId) => {
    // the client will call the new client 
    const call =  getPeer().call(userId, localStream);
    console.log("connecting to new user " + userId);
    const audio = document.createElement('audio');
    audio.id= userId;
    call.on('stream', (stream) => {
      console.log("received stream");
      addAudioStream(audio, stream);
    });
  };
  // handle client side disconnects
  // const handleDisconnect = () => {
  //   getPeer().on('disconnected', () => {
  //     // disconnect and call join call
  //   });
  // }

  const muteAudio = () => {
    setIsMuted(true);
    localStream.getAudioTracks()[0].enabled = false;
  }
  const unmuteAudio = () => {
    setIsMuted(false);
    localStream.getAudioTracks()[0].enabled = true;
  }
  // 
  const disconnectCall = () => {
    setIsDisconnected(true);
    setIsInCall(false);
    getSocket().emit("leave-call");
    getPeer().destroy();
    // TODO remove current audio streams that are playing
    setuserlist([]);
  }
  getPeer().on('open', (id)=> {
    getSocket().emit("set-id",id);
  })


  return (
      <div id="voicecall">
          {!isInCall && <Button onClick={joinRoom}>Join Call</Button>}
          {!isMuted && isInCall&& <Button onClick={muteAudio}>Mute microphone</Button>}
          {isMuted &&isInCall && <Button onClick={unmuteAudio}>Unmute microphone</Button>}
          {isInCall && <Button onClick={disconnectCall}>Leave Call</Button>}
          <div id="audiolists">
            {userlist.map((user)=> {<audio id={user} controls autoPlay></audio>})}
          </div>  
      </div>
  )
}
