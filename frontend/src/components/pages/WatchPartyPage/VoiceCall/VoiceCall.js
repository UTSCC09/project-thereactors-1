import './VoiceCall.scss';
import React, { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { getSocket } from 'components/utils/socket_utils';
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
let localStream
let isRoomCreator
let rtcPeerConnection // Connection between the local device and the remote peer.

export default function VoiceCall() {
      var audioElement = document.getElementById('audio');

      function joinRoom() {
        await setLocalStream(mediaConstraints)
        getSocket().emit('join-call');
      }
            
      function addLocalTracks(rtcPeerConnection) {
        localStream.getTracks().forEach((track) => {
          rtcPeerConnection.addTrack(track, localStream)
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
      
        socket.emit('webrtc-offer', {
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
      
        socket.emit('webrtc-answer', {
          type: 'webrtc_answer',
          sdp: sessionDescription,
        })
      }
      
      function setRemoteStream(event) {
        remoteStream = event.stream
        audioElement.srcObject = remoteStream;
      }
      
      function sendIceCandidate(event) {
        if (event.candidate) {
          socket.emit('webrtc-ice-candidate', {
            label: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
          })
        }
      }
      async function setLocalStream(mediaConstraints) {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
        } catch (error) {
        }
        localStream = stream
      }
      
    useEffect(() => {          
          getSocket().on('room-created', async () => {            
            await setLocalStream(mediaConstraints)
            isRoomCreator = true
            })
          getSocket().on('room-joined', async () => {          
            await setLocalStream(mediaConstraints)
            getSocket().emit('start-call')
          });

          getSocket().on('start-call', async () => {
            if (isRoomCreator) {
              rtcPeerConnection = new RTCPeerConnection(iceServers)
              addLocalTracks(rtcPeerConnection)
              rtcPeerConnection.ontrack = setRemoteStream
              rtcPeerConnection.onicecandidate = sendIceCandidate
              await createOffer(rtcPeerConnection)
            }
          })
          
          getSocket().on('webrtc-offer', async (event) => {          
            if (!isRoomCreator) {
              rtcPeerConnection = new RTCPeerConnection(iceServers)
              addLocalTracks(rtcPeerConnection)
              rtcPeerConnection.ontrack = setRemoteStream
              rtcPeerConnection.onicecandidate = sendIceCandidate
              rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
              await createAnswer(rtcPeerConnection)
            }
          })
          
          getSocket().on('webrtc-answer', (event) => {          
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
          })
          
          getSocket().on('webrtc-ice-candidate', (event) => {
            // ICE candidate configuration.
            var candidate = new RTCIceCandidate({
              sdpMLineIndex: event.label,
              candidate: event.candidate,
            })
            rtcPeerConnection.addIceCandidate(candidate)
          })

    }, []);
    
    return (
        <div>
            <audio id="audio" controls autoplay></audio>
            <Button onClick={joinRoom()}></Button>

        </div>
    )
}