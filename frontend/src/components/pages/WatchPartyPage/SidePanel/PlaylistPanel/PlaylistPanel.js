import './PlaylistPanel.scss';
import 'global.scss';
import React, { useEffect, useState } from "react";
import { getSocket } from 'components/utils/socket_utils';
import * as authAPI from 'auth/auth_utils.js';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ReactSortable } from "react-sortablejs";

export default function PlaylistPanel({playlistData, setCloseIcon}) {
    const [playlist, setPlaylist] = useState(playlistData.playlist);
    const [currentIdx, setCurrentIdx] = useState(playlistData.currentIdx);
    const [orderChange, setOrderChange] = useState(false);
    const [theme, setTheme] = useState('');

    const removeFromList = (index) => {
        let temp = [...playlist];
        temp.splice(index, 1);
        getSocket().emit('update-playlist', temp);
    }

    const changeVideo = (index) => {
        getSocket().emit('update-index', index);
    }

    const onDrop = (e) => {
        document.querySelectorAll('.dragabble')[e.oldIndex].style.background = 
            theme === 'dark' ? '#282828' : 'white';
        setOrderChange(true);
        getSocket().emit('update-playlist', playlist);
    }

    useEffect(() => {
        setCloseIcon(document.getElementById('close-icon'));

        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });
    }, [])
    
    useEffect(() => {
        setPlaylist(playlistData.playlist);
        setCurrentIdx(playlistData.currentIdx);
        if (authAPI.getUser() === playlistData.host && orderChange) {
            const elems = document.querySelectorAll('.dragabble');
            elems.forEach((el, index) => {
                if (index !== playlistData.currentIdx) {
                    el.style.background = theme === 'dark' ? '#282828' : 'white';
                    el.onmouseover = () => {
                        el.style.background = theme === 'dark' ? 'rgba(0,0,0,.12)' : 'rgba(0,0,0,.1)';
                    }
                    el.onmouseout = () => {
                        el.style.background = theme === 'dark' ? '#282828' : 'white';
                    }
                } else {
                    el.style.background = 'rgba(0,0,0,.35)';
                    el.onmouseover = () => {
                        el.style.background = 'rgba(0,0,0,.35)';
                    }
                    el.onmouseout = () => {
                        el.style.background = 'rgba(0,0,0,.35)';
                    }
                }
            })
        }
    }, [playlistData])

    const getClass = (index) => {
        if (theme === 'dark') {
            return currentIdx === index ? 'playlist-item-wrapper-current dragabble' : 'playlist-item-wrapper-dark dragabble';
        }
        return currentIdx === index ? 'playlist-item-wrapper-current dragabble' : 'playlist-item-wrapper dragabble';
    }
    
    return (
        <div className='playlist-panel'>
            <div className='header'>
                <div>Queue 
                {playlist?.length > 0 && <span> ({currentIdx+1}/{playlist.length})</span>}
                </div>
                <ArrowBackIosNewIcon id='close-icon' />
            </div>
            {authAPI.getUser() === playlistData.host &&
                <ReactSortable 
                    list={playlist}
                    setList={setPlaylist}
                    onEnd={(e)=>onDrop(e)}
                    swapThreshold={0.6}
                    animation={200}
                    swap
                >
                {playlist?.length > 0 &&
                    playlist.map((item, index) => {
                        return (
                        <div key={item.link} className={getClass(index)}>
                            <div className='drag-btn'>
                                <DragIndicatorIcon />
                            </div>
                            <div className='clickable-area' onClick={()=>changeVideo(index)}>
                                <div className='thumbnail-wrapper'><img className='thumbnail' src={item.thumbnail} /></div>
                                <div className='title'>{item.title}</div>
                            </div>
                            <div className='item-delete-btn'>
                                <ClearIcon onClick={()=>removeFromList(index)} />
                            </div>
                        </div>
                        )
                    })
                }
                </ReactSortable>
            }
            {authAPI.getUser() !== playlistData.host &&
                playlist?.length > 0 &&
                playlist.map((item, index) => {
                    return (
                    <div key={index} className={currentIdx === index ? 'playlist-item-wrapper-current-guest' : 'playlist-item-wrapper-guest'}>
                        <div className='clickable-area'>
                            <div className='thumbnail-wrapper'><img className='thumbnail' src={item.thumbnail} /></div>
                            <div className='title'>{item.title}</div>
                        </div>
                    </div>
                    )
                })
            }
        </div>
    )
}