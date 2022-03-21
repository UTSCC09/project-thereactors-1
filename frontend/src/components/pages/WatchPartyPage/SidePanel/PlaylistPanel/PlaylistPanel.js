import './PlaylistPanel.scss';
import React, { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { getSocket } from 'components/utils/socket_utils';
import * as videoUtils from 'components/utils/video_utils';
import * as authAPI from 'auth/auth_utils.js';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function PlaylistPanel({playlistData, setCloseIcon}) {

    const removeFromList = (index) => {
        let temp = [...playlistData.playlist];
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
                {playlistData.playlist?.length > 0 && <span> ({playlistData.currentIdx+1}/{playlistData.playlist.length})</span>}
                </div>
                <ArrowBackIosNewIcon id='close-icon' />
            </div>
            {playlistData.playlist?.length > 0 &&
                playlistData.playlist.map((item, index) => {
                    return (
                        <div key={index}>
                            {authAPI.getUser() === playlistData.host &&
                                <div className={playlistData.currentIdx === index ? 'playlist-item-wrapper-current' : 'playlist-item-wrapper'}>
                                    <div class='clickable-row' onClick={()=>changeVideo(index)}>
                                        <div className='thumbnail-wrapper'><img className='thumbnail' src={item.thumbnail} /></div>
                                        <div className='title'>{item.title}</div>
                                    </div>
                                    <div className='item-delete-btn'>
                                        <ClearIcon onClick={()=>removeFromList(index)} />
                                    </div>
                                </div>
                            }
                            {authAPI.getUser() !== playlistData.host &&
                                <div className={playlistData.currentIdx === index ? 'playlist-item-wrapper-current-guest' : 'playlist-item-wrapper-guest'}>
                                    <div class='clickable-row'>
                                        <div className='thumbnail-wrapper'><img className='thumbnail' src={item.thumbnail} /></div>
                                        <div className='title'>{item.title}</div>
                                    </div>
                                </div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}