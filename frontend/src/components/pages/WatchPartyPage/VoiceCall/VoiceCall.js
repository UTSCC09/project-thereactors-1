import './VoiceCall.scss';
import React, { useEffect, useRef, useState } from "react";
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
    ],
  }
let peer;
// let localStream;
export default function VoiceCall() {
  const [localStream,setLocalStream] = useState();
  const [userlist,setuserlist] = useState([]);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted,setIsMuted] = useState(false);
  const [audiolist, setaudiolist] = useState([]);
  const history = useHistory();

  useEffect(() => {
    return history.listen((location) => { 
       disconnectCall();
    }) 
  },[history]) ;


  const getPeer = ()=> {
    if(!peer || peer.destroyed) {
      // can add options here
      peer = new Peer(undefined, {
        path: '/peerjs',
        host:  peerhost,
        port: peerhostport,
        config: iceServers,
      });
      peer.on('open', (id)=> {
        console.log("set id");
        getSocket().emit("set-id",id);
      });
      console.log("start new peer connection")
    }
    return peer;
  }

  const disconnectCall = () => {
    setIsInCall(false);
    getSocket().emit("leave-call");
    getPeer().destroy();
    if(localStream) {
      localStream.getTracks().forEach((track)=> {
        track.stop();
      })
      setLocalStream(null);
    }
    // setReadyForCall(false);
    setIsMuted(false);
    setuserlist([]);
    // setaudiolist([]);
  }

  // called whenever the user clicks join room
  // should tell server that it joins room, 
  // then allow the user to answer calls
  const joinRoom = ()=> {
    // console.log("attempt to join-call")
    navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream)=> {
      setLocalStream(stream);
      getSocket().emit('join-call');
      setIsInCall(true);
    });
  }

  // useEffect(()=> {
  //   // console.log(localStream);
  // },[localStream]) 
  const muteAudio = () => {
    setIsMuted(true);
    localStream.getAudioTracks()[0].enabled = false;
  }
  const unmuteAudio = () => {
    setIsMuted(false);
    localStream.getAudioTracks()[0].enabled = true;
  }
  const updatestream = (arr,stream,userid) => {
    let tmp = [...arr];
    tmp = tmp.map(obj => (obj.userid === userid ? {... obj,stream:stream} : obj)); 
    // console.log(tmp);
    return tmp;
  } 

  useEffect(()=> {
    // console.log("rerender");
    // console.log(userlist);
    for(const obj of userlist) {
      if (document.getElementById(obj.user+ "-audio") && !document.getElementById(obj.user+ "-audio").srcObject && obj.stream){
        document.getElementById(obj.user+ "-audio").srcObject = obj.stream;
      }
    }
    setaudiolist([...userlist]);
  },[userlist])

  useEffect(()=> {
    getSocket().off('user-id-map');
    getSocket().off('voice-leaver');
    getSocket().off('voice-joiner');
    getPeer();
    if(isInCall) {
      getPeer().off('call');
      getPeer().on('call',(call) => {
        // console.log("received call from " + call.peer);
        call.answer(localStream);
        // answer incoming stream
        call.on('stream',(stream) => {
          // console.log("received stream from " + call.peer);
          handleGetStream(stream, call.peer);
        });
      });
  
    }

  // this function is called when there is a socket event to add a new user to the call
  // peer calls the peerid and sends the users mediastream
  const connectToNewUser = (userId,username) => {
    // no self calling
    // console.log("connecting");
    console.log(userlist);
    if(userId === getPeer().id) {
      return;
    }
    // the client will call the new client 
    let call = getPeer().call(userId, localStream);
    if (call) {
      console.log("connecting to new user " + userId);
      call.on('stream', (stream) => {
        console.log("received stream from callee");
        handleGetStream(stream,userId);
      });
    } else {
      console.log("call failed");
    }
  };
  const handleGetStream = (stream, userid) => {
    // const audio = document.createElement('audio');
    // audio.id= userid;
    // addAudioStream(audio, stream);
    console.log("handling stream");
    let index = userlist.findIndex((obj=> obj.userid === userid));
    let tmp = userlist;
    console.log(tmp);

    if(index != -1){
      console.log('updated ' + userlist[index].user + "'s stream");
      console.log('AFTHWEIOAFHIEAWOFJWA P;')
      // didnt trigger refresh which is weird
      // console.log(stream);
      // tmp = tmp.map(obj => (obj.userid === userid ? {... obj} : obj));
      // setaudiolist(prev => {return prev.map(obj => (obj.userid === userid ? {... obj,stream} : obj));});
      setuserlist(prev => {return updatestream(prev,stream,userid);});
    }
    console.log(userlist);
  } 
    // happens whenever the user joins the voice call
    // sets the list of current users in the room
    getSocket().on('user-id-map',(data,username) => {
      console.log("just joined ")
      let tmp = data;
      let index = tmp.findIndex((obj=> obj.user === username));
      if(index != -1){
        console.log('updated ' + tmp[index].user + "'s stream")
        tmp[index].stream = localStream;
      }
      setuserlist(tmp)
    });

    // check when other users disconnect
    getSocket().on('voice-leaver',(username) => {
      // remove from list and update
      console.log(username + " left call");
      console.log(userlist);
      let tmp = userlist.filter((e) => {return e.user !== username}); 
      console.log(userlist);
      setuserlist(tmp)
      // setaudiolist(tmp);
    });

    // set up to handle new user events
    // socket listens for new user joining the call 
    // it should update the user to id mapping list
    getSocket().on('voice-joiner',(userid,username) => {
      console.log("voice joiner "  + userid + " " + username);
      console.log(userlist)
      let tmp = userlist;
      let index = tmp.findIndex((obj=> obj.user === username));
      if(index == -1) {
        console.log("add voice joiner");
        tmp.push({user:username, userid:userid, stream:''});
        console.log(tmp);
      } else {
        // update user mapping if it already exists for some reason
        console.log("update voice joiner id");
        tmp[index].userid = userid;
      }
      setuserlist(tmp)
      connectToNewUser(userid,username);
    });
  },[userlist,isInCall,audiolist,localStream]); 

  return (
    <div className='voicecall'>
      {!isInCall && <RecordVoiceOverIcon className='voicecall-btn' onClick={joinRoom} />}
      {isInCall && <ExitToAppIcon className='voicecall-btn leave-icon' onClick={disconnectCall} />}
      {!isMuted && isInCall && <MicIcon className='voicecall-btn' onClick={muteAudio} />}
      {isMuted && isInCall && <MicOffIcon className='voicecall-btn' onClick={unmuteAudio} />}
      <div id="audiolists">
        {userlist.map((user)=> <UserAudio key={user.user} thisUser={user} clientid={getPeer()._id}/>)}
      </div>
    </div>
  )
}
