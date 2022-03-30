import './VoiceCall.scss';
import React, { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { getSocket } from 'components/utils/socket_utils';
import Peer from 'peerjs';
import { useHistory } from 'react-router-dom'
import { UserAudio } from './UserAudio';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { getConfig } from 'environments';

const peerhost = getConfig("peerhost");
const peerhostport = getConfig("peerhostport");
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
let peer;
let localStream;
export default function VoiceCall() {
  // const [userlist,setuserlist] = useState([]); // userlist =  [{username: string, id: string}]
  let userlist = [];
  const setuserlist = (data) => {
    userlist = data;
  }
  const [isDisconnected,setIsDisconnected] = useState(true);
  const [isInCall,setIsInCall] = useState(false);
  const [isMuted,setIsMuted] = useState(false);
  const [audiolist, setaudiolist] = useState([]);
  const history = useHistory();

  useEffect(() => {
    return history.listen((location) => { 
       disconnectCall();
    }) 
 },[history]) ;

 useEffect(() => {
  console.log(audiolist);
 },[audiolist])

  getSocket().on('user-id-map',(data) => {
    userlist = data;
  }); 

  getSocket().on('voice-joiner', (id,username) => {
    let index = userlist.findIndex((obj=> obj.userid === id))
    if(index == -1) {
      userlist.push({user:username, userid:id, stream:''});
      // setaudiolist(userlist);
    }
  });

  getSocket().on('voice-leaver',(id) => {
    let index = userlist.findIndex((obj=> obj.userid === id))
    // remove from list and update
    if( index != -1) {
      userlist.splice(index,1);
      setaudiolist(userlist);
    }
  });

  function getPeer() {
    if(!peer || isDisconnected) {
      // can add options here
      peer = new Peer(undefined, {
        path: '/peerjs',
        host:  peerhost,
        port: peerhostport,
        config: iceServers,
      });
      setIsDisconnected(false);
      console.log("new peer connection")
    }
    return peer;
  }
  function handleNewJoiner(userid) {
    connectToNewUser(userid,localStream );
  }

  function joinRoom() {
    console.log("attempt to join-call")
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
      // answer incoming stream
      call.on('stream',(stream) => {
        console.log("received stream from call")
        handleGetStream(stream, call.peer);
      });
    });
    // set up to handle new user events
    getSocket().on('voice-joiner',(userid) => {
      if(userid)
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
  const handleGetStream = (stream, userid) => {
    // const audio = document.createElement('audio');
    // audio.id= userid;
    // addAudioStream(audio, stream);
    let index = userlist.findIndex((obj=> obj.userid === userid));
    if(index != -1){
      userlist[index].stream = stream;
    }
    let index2 = userlist.findIndex((obj=> obj.userid === getPeer()._id))
    if(index2 != -1)
      userlist[index2].stream = localStream;
    setaudiolist(userlist);
  } 
  // this function is called when there is a socket event to add a new user to the call
  const connectToNewUser = (userId) => {
    // no self calling
    if(userId === getPeer()._id) {
      return;
    }
    // the client will call the new client 
    const call = getPeer().call(userId, localStream);
    console.log("connecting to new user " + userId);
    call.on('stream', (stream) => {
      console.log("received stream from callee");
      handleGetStream(stream,userId);
    });
  };

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
    if(localStream) {
      localStream.getTracks().forEach((track)=> {
        track.stop();
      })
      localStream = null;
    }
    
    // TODO remove current audio streams that are playing
    setIsMuted(false);
    setuserlist([]);
    setaudiolist([]);
  }
  getPeer().on('open', (id)=> {
    getSocket().emit("set-id",id);
  })


  return (
    <div className='voicecall'>
      {!isInCall && <RecordVoiceOverIcon className='voicecall-btn' onClick={joinRoom} />}
      {isInCall && <ExitToAppIcon className='voicecall-btn leave-icon' onClick={disconnectCall} />}
      {!isMuted && isInCall && <MicIcon className='voicecall-btn' onClick={muteAudio} />}
      {isMuted && isInCall && <MicOffIcon className='voicecall-btn' onClick={unmuteAudio} />}
      <div id="audiolists">
        {audiolist.map((user)=> <UserAudio key={user.user} thisUser={user} clientid={getPeer()._id}/>)}
      </div>
    </div>
  )
}
