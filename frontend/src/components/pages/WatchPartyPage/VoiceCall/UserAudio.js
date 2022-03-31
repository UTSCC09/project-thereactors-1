import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import * as UserAPI from 'api/user';

export const UserAudio = ({ thisUser: { user, userid ,stream }, clientid})  => {
    const [avatar, setAvatar] = useState(null);
    
    useEffect(()=> {
        let audio = document.getElementById(user+"-audio");
        console.log("update audio " + user);
        if(stream) {
            // console.log("updating stream " + user);
            audio.srcObject = stream;
        }
        audio.controls = 'controls';
        audio.addEventListener("loadeddata",() => {
            if(clientid === userid) {
                audio.pause();
            } else {
                audio.play();
            }
        });

        UserAPI.getAvatar(user, (avatar) => {
            setAvatar(avatar);
        });
    },[]);

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
