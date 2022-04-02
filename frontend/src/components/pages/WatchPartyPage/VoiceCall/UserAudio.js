import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import * as UserAPI from 'api/user';

export const UserAudio = ({ thisUser: { user, userid ,stream }, clientid})  => {
    const [avatar, setAvatar] = useState(null);

    /* vars used to analyse audio frequencies passed from the stream */
    let loopFn = null;
    let audioSrc = null;
    let data = new Uint8Array();
    const audioCtx = new AudioContext(); 
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0;
    
    const loopingFunction = () => {
        analyser.getByteFrequencyData(data);
        let maxFreq = Math.max(...data);
        if (maxFreq > 95) {
            if (document.getElementById(`${userid}-audio-icon`)) {
                document.getElementById(`${userid}-audio-icon`).style.border = '2.5px solid green';
            }
        } else {
            if (document.getElementById(`${userid}-audio-icon`)) {
                document.getElementById(`${userid}-audio-icon`).style.border = 'none';
            }
        }
    };
    
    useEffect(() => {        
        UserAPI.getAvatar(user, (avatar) => {
            setAvatar(avatar);
        });
        
        return () => {
            clearInterval(loopFn);
            if (document.getElementById(userid+"-audio-avatar")) {
                document.getElementById(userid+"-audio-avatar").removeChild(document.getElementById(userid+"-audio-avatar").firstElementChild);
            }
            analyser.disconnect();
            if(audioSrc) {
                audioSrc.disconnect();
            }
        }
    },[]);
    
    useEffect(() => {
        if (stream) {
            let audio = document.getElementById(userid+"-audio");
            audio.srcObject = stream;
            audioSrc = audioCtx.createMediaStreamSource(stream);
            audioSrc.connect(analyser);
            if (clientid !== userid) {
                analyser.connect(audioCtx.destination); // to prevent audio feedback for current user
            }
            data = new Uint8Array(analyser.frequencyBinCount);
            loopFn = setInterval(() => {
                loopingFunction();
            }, 300);
        }
    }, [stream]);

    return (
        <>
        {avatar && 
            <div id={userid+"-audio-avatar"} className='audio-avatar'>
            <Avatar src={avatar} id={userid+"-audio-icon"} className='icon' title={user} />
            </div>
        }
        <audio id={userid+"-audio"} style={{display:'none'}}></audio>
        </>
    )
}
