import './PlaylistPanel.scss';
import React, { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { getSocket } from 'components/utils/socket_utils';
import * as videoUtils from 'components/utils/video_utils';
import * as authAPI from 'auth/auth_utils.js';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function PlaylistPanel({playlistData, setCloseIcon}) {

    const removeFromList = (index) => {
        let temp = [...playlistData.list];
        temp.splice(index, 1);
        getSocket().emit('update-playlist', temp);
    }

    const changeVideo = (index) => {
        getSocket().emit('update-index', index);
    }

    useEffect(() => {
        setCloseIcon(document.getElementById('close-icon'));
    }, [])

    return (
        <div className='playlist-panel'>
            <div className='header'>
                <div>Queue 
                {playlistData.list?.length > 0 && <span> ({playlistData.currentIdx+1}/{playlistData.list.length})</span>}
                </div>
                <ArrowBackIosNewIcon id='close-icon' />
            </div>
            {playlistData.list?.length > 0 &&
                playlistData.list.map((link, index) => {
                    return (
                        <div key={index}>
                            {authAPI.getUser() === playlistData.host &&
                                <div className={playlistData.currentIdx === index ? 'playlist-item-wrapper-current' : 'playlist-item-wrapper'}>
                                    <div className='item' onClick={()=>changeVideo(index)}><img className='thumbnail' src={videoUtils.getVideoThumbnail(link)} /></div>
                                    <div className='item-delete-btn'>
                                        <ClearIcon onClick={()=>removeFromList(index)} />
                                    </div>
                                </div>
                            }
                            {authAPI.getUser() !== playlistData.host &&
                                <div className={playlistData.currentIdx === index ? 'playlist-item-wrapper-current-guest' : 'playlist-item-wrapper-guest'}>
                                    <div className='item'><img className='thumbnail' src={videoUtils.getVideoThumbnail(link)} /></div>
                                </div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}