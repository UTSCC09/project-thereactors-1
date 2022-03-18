import './PlaylistPanel.scss';
import React, { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';

const videos = [
    "https://youtu.be/HCDVN7DCzYE",
    "https://youtu.be/pTn6Ewhb27k",
    "https://youtu.be/XRr1kaXKBsU"
];

export default function PlaylistPanel() {
    const [list, setList] = useState(videos);
    const [currentIdx, setCurrentIdx] = useState(0);

    const getVideoId = (link) => {
        if (link.includes("https://www.youtube.com/watch?v=")) {
            return "https://img.youtube.com/vi/" + link.split('watch?v=')[1] + "/0.jpg";
        }
        return "https://img.youtube.com/vi/" + link.split('youtu.be/')[1] + "/0.jpg";
    }

    const removeFromList = (index) => {
        let temp = [...list];
        temp.splice(index, 1);
        setList(temp);
        // call socket to sync
    }

    const changeVideo = (index) => {
        setCurrentIdx(index);
        // call socket to sync
    }

    return (
        <div className='playlist-panel'>
            <div className='header'>Queue ({currentIdx+1}/{list.length})</div>
            {list?.length > 0 &&
                list.map((link, index) => {
                    return (
                        <div key={index} className={currentIdx === index ? 'playlist-item-wrapper-current' : 'playlist-item-wrapper'}>
                            <div className='item' onClick={()=>changeVideo(index)}><img className='thumbnail' src={getVideoId(link)} /></div>
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