import './PlaylistPanel.scss';
import React, { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { getSocket } from 'components/utils/socket_utils';
import * as videoUtils from 'components/utils/video_utils';

export default function PlaylistPanel({playlistData}) {

    const removeFromList = (index) => {
        let temp = [...playlistData.list];
        temp.splice(index, 1);
        getSocket().emit('update-playlist', temp);
    }

    const changeVideo = (index) => {
        getSocket().emit('update-index', index);
    }

    return (
        <div className='playlist-panel'>
            <div className='header'>Queue 
                {playlistData.list?.length > 0 && <span> ({playlistData.currentIdx+1}/{playlistData.list.length})</span>}
            </div>
            {playlistData.list?.length > 0 &&
                playlistData.list.map((link, index) => {
                    return (
                        <div key={index} className={playlistData.currentIdx === index ? 'playlist-item-wrapper-current' : 'playlist-item-wrapper'}>
                            <div className='item' onClick={()=>changeVideo(index)}><img className='thumbnail' src={videoUtils.getVideoThumbnail(link)} /></div>
                            <div className='item-delete-btn'>
                                <ClearIcon onClick={()=>removeFromList(index)} />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}