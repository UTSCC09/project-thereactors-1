import './PlaylistPanel.scss';
import React, { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { getSocket } from 'components/utils/socket_utils';
import * as videoUtils from 'components/utils/video_utils';

export default function PlaylistPanel({playlistData}) {
    const [list, setList] = useState(playlistData.list);
    const [currentIdx, setCurrentIdx] = useState(playlistData.currentIdx);

    const removeFromList = (index) => {
        let temp = [...list];
        temp.splice(index, 1);
        setList(temp);
        getSocket().emit('update-playlist', temp);
    }

    const changeVideo = (index) => {
        setCurrentIdx(index);
        getSocket().emit('update-index', index);
    }

    return (
        <div className='playlist-panel'>
            <div className='header'>Queue 
                {list?.length > 0 && <span> ({currentIdx+1}/{list.length})</span>}
            </div>
            {list?.length > 0 &&
                list.map((link, index) => {
                    return (
                        <div key={index} className={currentIdx === index ? 'playlist-item-wrapper-current' : 'playlist-item-wrapper'}>
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