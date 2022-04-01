import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import * as UserAPI from 'api/user';

export const UserAudio = ({ thisUser: { user, userid ,stream }, clientid})  => {
    const [avatar, setAvatar] = useState(null);
    const [isStreamed, setStreamed ] = useState(false);

    let loopFn = null;
    let audioSrc = null;
    let data = new Uint8Array();
    const audioCtx = new AudioContext(); 
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    
    const loopingFunction = () => {
        analyser.getByteFrequencyData(data);
        let avgFreq = data.reduce((partialSum, x) => partialSum + x, 0) / data.length;
        // let maxFreq = Math.max(...data);
        // if (maxFreq > 100) {
        if (avgFreq > 7) {
            if (document.getElementById(`${userid}-audio-icon`)) {
                document.getElementById(`${userid}-audio-icon`).style.border = '2.5px solid green';
            }
        } else {
            if (document.getElementById(`${userid}-audio-icon`)) {
                document.getElementById(`${userid}-audio-icon`).style.border = 'none';
            }
        }
    };
    
    useEffect(()=> {
        let audio = document.getElementById(userid+"-audio");
        audio.addEventListener("loadeddata",() => {
            if (clientid !== userid) {
                if(stream && !isStreamed) {
                    analyser.connect(audioCtx.destination); // so that user doesn't hear himself
                    setStreamed(true);
                }
            }
        });
        
        UserAPI.getAvatar(user, (avatar) => {
            setAvatar(avatar);
        });
        
        return () => {
            clearInterval(loopFn);
            if(document.getElementById(`${user}-audio-icon`))
                document.getElementById(`${user}-audio-icon`).style.border = 'none';
            analyser.disconnect();
            if(audioSrc)
                audioSrc.disconnect();
        }
    },[]);
    
    useEffect(()=>{
        if (stream) {
            let audio = document.getElementById(userid+"-audio");
            audio.srcObject = stream;
            audioSrc = audioCtx.createMediaStreamSource(stream);
            audioSrc.connect(analyser);
            if (clientid !== userid && !isStreamed) {
                analyser.connect(audioCtx.destination);
                setStreamed(true);
            }
            data = new Uint8Array(analyser.frequencyBinCount);
            loopFn = setInterval(() => {
                loopingFunction();
            }, 500);
        }
    }, [stream]);

    return (
        <>
        {avatar && 
            <div className='audio-avatar'>
            <Avatar src={avatar} id={userid+"-audio-icon"} className='icon' title={user} />
            </div>
        }
        <audio id={userid+"-audio"} style={{display:'none'}}></audio>
        </>
    )
}
