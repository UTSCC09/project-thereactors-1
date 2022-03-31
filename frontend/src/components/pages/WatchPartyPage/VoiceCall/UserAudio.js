import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import * as UserAPI from 'api/user';

export const UserAudio = ({ thisUser: { user, userid ,stream }, clientid})  => {
    const [avatar, setAvatar] = useState(null);
    const [data1, setData1] = useState([]);

    const audioTest = async (stream1) => {
        // if (navigator.mediaDevices.getUserMedia !== null) {
            const options = {
              video: false,
              audio: true,
            };
            try {
                const stream = stream1.getAudioTracks()[0]; 
                console.log(stream)       
                // const stream = await navigator.mediaDevices.getUserMedia(options);        
                const audioCtx = new AudioContext(); 
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 2048;       
                const audioSrc = audioCtx.createMediaStreamSource(stream);
                audioSrc.connect(analyser);
                const data = new Uint8Array(analyser.frequencyBinCount);
                setData1(data);
            } catch (err) {
              // error handling
              console.log(err);
            }
        // }
    }
    
    useEffect(()=>{
        console.log(data1);
    }, [data1])

    useEffect(()=> {
        let audio = document.getElementById(user+"-audio");
        if(stream) {
            audio.srcObject = stream;
        }
        audio.controls = 'controls';
        audio.addEventListener("loadeddata",() => {
            // if(clientid === userid) {
            //     audio.pause();
            // } else {
                audio.play();
            // }
        });

        UserAPI.getAvatar(user, (avatar) => {
            setAvatar(avatar);
        });
    },[stream, user]);
    
    useEffect(()=>{
        console.log('stream', stream)
        // audioTest(stream);
    }, [stream.getAudioTracks()])

    return (
        <>
        {avatar && 
            <div className='audio-avatar'>
            <Avatar src={avatar} className='icon' />
            </div>
        }
        <audio id={user+ "-audio"} style={{display:'none'}} controls autoPlay></audio>
        </>
    )
}
