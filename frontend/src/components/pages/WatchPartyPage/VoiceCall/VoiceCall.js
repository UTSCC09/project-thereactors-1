import './VoiceCall.scss';
import React, { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { getSocket } from 'components/utils/socket_utils';
import Peer from 'peerjs';


const mediaConstraints = {audio: true, video: false }

const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  }
let peer
let localStream
let remoteStream
let isRoomCreator
let rtcPeerConnection // Connection between the local device and the remote peer.

export default function VoiceCall() {
  function getPeer() {
    if(!peer) {
      peer = new Peer({config: iceServers});
    }
    return peer;
  }
    function getRemoteStream() {
      return remoteStream;
    }
    function getLocalStream() {
      return localStream;
    }
    function getisRoomCreator() {
      return isRoomCreator;
    }
    function setisRoomCreator(val) {
      isRoomCreator = val;
    }
    function getrtcPeerConnection() {
      return rtcPeerConnection;
    }
    function setrtcPeerConnection(val) {
      rtcPeerConnection = val;
    }    
    async function joinRoom() {
      await setLocalStream(mediaConstraints)
      getSocket().emit('join-call');
    }

    function addLocalTracks(rtcPeerConnection) {
      getLocalStream().getTracks().forEach((track) => {
        rtcPeerConnection.addTrack(track, getLocalStream())
      })
    }
    
    async function createOffer(rtcPeerConnection) {
      let sessionDescription
      try {
        sessionDescription = await rtcPeerConnection.createOffer()
        rtcPeerConnection.setLocalDescription(sessionDescription)
      } catch (error) {
        console.error(error)
      }
    
      getSocket().emit('webrtc-offer', {
        type: 'webrtc_offer',
        sdp: sessionDescription
      })
    }
    
    async function createAnswer(rtcPeerConnection) {
      let sessionDescription
      try {
        sessionDescription = await rtcPeerConnection.createAnswer()
        rtcPeerConnection.setLocalDescription(sessionDescription)
      } catch (error) {
        console.error(error)
      }
    
      getSocket().emit('webrtc-answer', {
        type: 'webrtc_answer',
        sdp: sessionDescription,
      })
    }
    
    function setRemoteStream(event) {
      remoteStream = event.stream
      document.getElementById('audio').srcObject = remoteStream;
    }
    
    function sendIceCandidate(event) {
      if (event.candidate) {
        getSocket().emit('webrtc-ice-candidate', {
          label: event.candidate.sdpMLineIndex,
          candidate: event.candidate.candidate,
        })
      }
    }
    async function setLocalStream(mediaConstraints) {
      let stream;
      let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      try {
        stream = await getUserMedia(mediaConstraints)
      } catch (error) {
        console.error('Could not get user media', error)
      }
      localStream = stream
    }
    
  useEffect(() => {          
        getSocket().on('room-created', async () => {            
          await setLocalStream(mediaConstraints)
          setisRoomCreator(true);
          });
        getSocket().on('room-joined', async () => {          
          await setLocalStream(mediaConstraints)
          getSocket().emit('start-call')
        });

        getSocket().on('start-call', async () => {
          if (getisRoomCreator()) {
            console.log('Socket event callback: start_call')
            setrtcPeerConnection(new RTCPeerConnection(iceServers))

            addLocalTracks(getrtcPeerConnection())
            getrtcPeerConnection().ontrack = setRemoteStream
            getrtcPeerConnection().onicecandidate = sendIceCandidate
            await createOffer(getrtcPeerConnection())
          }
        })
        
        getSocket().on('webrtc-offer', async (event) => {          
          
          if (!getisRoomCreator()) {
            console.log(!getisRoomCreator())
            console.log('Socket event callback: webrtc_offer')
            setrtcPeerConnection(new RTCPeerConnection(iceServers))
            addLocalTracks(getrtcPeerConnection())
            getrtcPeerConnection().ontrack = setRemoteStream
            getrtcPeerConnection().onicecandidate = sendIceCandidate
            getrtcPeerConnection().setRemoteDescription(new RTCSessionDescription(event))
            await createAnswer(getrtcPeerConnection())
          }
        })
        
        getSocket().on('webrtc-answer', (event) => {          
          console.log('Socket event callback: webrtc_answer')
          getrtcPeerConnection().setRemoteDescription(new RTCSessionDescription(event)).catch((err) => {
            console.log(err)
          })
        })
        
        getSocket().on('webrtc-ice-candidate', (event) => {
          console.log('Socket event callback: webrtc_offer')
          // ICE candidate configuration.
          var candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
          })
          getrtcPeerConnection().addIceCandidate(candidate)
        })

  }, []);
  
  return (
      <div>
          <audio id="audio" controls autoPlay></audio>
          <Button onClick={joinRoom}>Join Call</Button>

      </div>
  )
}