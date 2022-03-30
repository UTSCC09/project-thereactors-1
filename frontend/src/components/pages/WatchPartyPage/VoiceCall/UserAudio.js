import React, { useEffect, useState } from "react";


export const UserAudio = ({ thisUser: { user, userid ,stream }, clientid: clientid})  => {
    useEffect(()=> {

        let audio = document.getElementById(user+"-audio");
        audio.srcObject = stream;
        audio.controls = 'controls';
        audio.addEventListener("loadedmetadata",() => {
            if(clientid === userid) {
                audio.pause();
            } else {
                audio.play();
            }
          });
        console.log("here")
    },[]);
    return (
        <audio id={user+ "-audio"} controls autoPlay></audio>
    )
}
