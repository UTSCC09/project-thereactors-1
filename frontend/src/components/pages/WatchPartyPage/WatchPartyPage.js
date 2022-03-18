import './WatchPartyPage.scss';
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from 'react-player';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Button, TextField } from '@mui/material';
import ChatBox from "./ChatBox/ChatBox";
import io from 'socket.io-client';
import * as authAPI from 'auth/auth_utils.js';
import { getSocket } from 'components/utils/socket_utils';
import SidePanel from './SidePanel/SidePanel';
import { set } from 'lodash';

/*
    party_video_state 
        playedSeconds
        video_is_playing


*/

export default function WatchPartyPage() {
    // these are react-player states
    const [videoId, setVideoId] = useState('');
    const [tempVideoId, setTempVideoId] = useState('');
    const [tempVideoId2, setTempVideoId2] = useState('');
    const [playing, setPlaying] = useState(false);
    const [controls, setControls] = useState(true);
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    const playerRef = useRef();
    // custom states 
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [host, setHost] = useState('');
    const [party_video_state,setPartyVideoState] = useState({playedSeconds: 0,video_is_playing:false}); 
    const [playlist, setPlaylist] = useState([]);
    const [playlist_index, setPlaylistIndex] = useState(0);
    
    useEffect(() => {
        const vidWrapperBox = document.getElementById('video-player-wrapper').getBoundingClientRect();
        setVideoWidth(vidWrapperBox.width);
        setVideoHeight((vidWrapperBox.width / 16) * 9);

        window.onresize = () => {
            const vidWrapperBox1 = document.getElementById('video-player-wrapper').getBoundingClientRect();
            setVideoWidth(vidWrapperBox1.width);
            setVideoHeight((vidWrapperBox1.width / 16) * 9);
        }

        if(new URLSearchParams(window.location.search).get("id")){
            if (authAPI.signedIn())
                getSocket().emit('join-room', { roomname: new URLSearchParams(window.location.search).get("id")});
            else 
                window.location.href= '/join?id='+ new URLSearchParams(window.location.search).get("id");
        }
        else{
            window.location.href = '/join';
        }
            
        getSocket().on('curr_users',(usernames)=> {
            console.log(usernames);
            setConnectedUsers(usernames);
        });
        getSocket().on('host',(host)=> {
            setHost(host);
        });

        getSocket().on('password-missing',()=> {
            window.location.href= '/join?id='+ new URLSearchParams(window.location.search).get("id");
        });
        // playlist and video updates handling 
        getSocket().on('update-progress',(party_video_state)=> {
            handleUpdateProgress(party_video_state);
        });
        
        getSocket().on('playlist-changed',(data)=>{
            handlePlayListChange(data);
        })
        getSocket().on('playlist-index-updated',(newIndex)=> {
            handlePlaylistIndexUpdate(newIndex);
        });
    }, []);

    // handle video and playlist events

    const play = () => {
        setPlaying(true);
        if(host == authAPI.getUser()) {
            getSocket().emit('play-video');
        } else {
            setPlaying(party_video_state.video_is_playing);
            console.log("play  "+ party_video_state.video_is_playing);
            // setPlaying(true);
        }


        // sync with all users
    }

    const pause = () => {
        if(host == authAPI.getUser()) {
            getSocket().emit('pause-video', playerRef.current.getCurrentTime());
        } else {
            console.log("pause "+ party_video_state.video_is_playing);
            setPlaying(party_video_state.video_is_playing);
        }
        
        

        // sync with all users
    }

    const loadVideo = () => {
        addToPlaylist(tempVideoId); // only if host
        setTempVideoId('');
    }

    const loadVideo2 = () => {
        addToPlaylist(tempVideoId2); // only if host
        setTempVideoId2('');
    }

    const addToPlaylist = (url) => {
        if(host == authAPI.getUser()) {
            if(ReactPlayer.canPlay(url)) {
                getSocket().emit('update-playlist',[...playlist,url])
            }
        }
    }
    const handleOnReady = () => {
        // check if state of video should be playing
        setPlaying(party_video_state.video_is_playing);
        playerRef.current.seekTo(party_video_state.playedSeconds);
    }
    const handleOnEnded = () => {
        // check if state of video should be playing
        if(host == authAPI.getUser()) {
            getSocket().emit('video-ended');
        }
    }
    const handleVideoProgress = (progress) => {
        // party_video_state.playedSeconds = progress.playedSeconds;
        // use host's current video playtime to sync with other users
        // to make it seems like everyone is watching at the same time.
        // i.e, if other users stop their video, once they resume it, we 
        // will use the host's current video playtime to make them catch up.

        if(host == authAPI.getUser()) {
            // console.log('progress', progress.playedSeconds);
            getSocket().emit('update-video-progress', progress.playedSeconds);
        }
    }

    // handle socket events
    const handleUpdateProgress= (party_video_state)=> {
        // console.log(party_video_state);
        setPartyVideoState(party_video_state);
        setPlaying(party_video_state.video_is_playing);

        if(videoId && Math.abs(playerRef.current.getCurrentTime() - party_video_state.playedSeconds)  > 1) {
            playerRef.current.seekTo(party_video_state.playedSeconds);
        }
    }
    const handlePlaylistIndexUpdate= (newIndex)=> {
        setPlaylistIndex(newIndex);
        if(newIndex < 0 || newIndex >= playlist.length) {
            setVideoId('');
        } else {
            if( videoId ==''  || playlist[newIndex] != videoId)
                setVideoId(playlist[newIndex]);
        }
    }

    const handlePlayListChange= (data)=> {
        setPlaylist(data.playlist);
        setPlaylistIndex(data.current_vid);
        // console.log(data.current_vid + " playlist index")
        // console.log(data.playlist)

        if(data.current_vid < 0 || data.current_vid >= data.playlist.length) {
            console.log("here")
            setVideoId('');
        } else {
            if( videoId ==''  ||data.playlist[data.current_vid] != videoId)
                setVideoId(data.playlist[data.current_vid]);
        }

    }

    return (
        <div className="watch-party-page">
            <div className='col1'>
                <SidePanel />
            </div>
            <div className='col2'>
                <div id='video-player-wrapper' className='video-player-wrapper'>
                    {videoId !== '' && videoWidth !== '' && videoHeight !== '' &&
                        <ReactPlayer 
                            ref ={playerRef}
                            url={videoId}
                            controls={controls}
                            playing={playing}
                            onProgress={handleVideoProgress}
                            onPlay={play}
                            onPause={pause}
                            width={videoWidth}
                            height={videoHeight}
                            onReady={handleOnReady}
                            onEnded={handleOnEnded}
                            
                        />
                    }
                    {videoId === '' &&
                        <div className='add-video-wrapper' style={{height: videoHeight, width: videoWidth}}>
                            <div className='inner-wrapper'>
                            <TextField 
                                label="Enter video url"
                                size='small'
                                style={{
                                    marginRight: 5,
                                    width: '100%'
                                }}
                                value={tempVideoId}
                                onChange={(e)=>setTempVideoId(e.target.value)}
                            />
                            <Button type='submit' className='load-btn' variant='outlined' onClick={()=>loadVideo()}>load</Button>
                            </div>
                        </div>
                    }
                </div>
                <div className='desc-row'>
                    <div className='host'>
                        <span style={{marginRight: 4}}>Host:</span>
                        <Avatar  style={{marginRight: 4}} title={host} className='host-icon' />
                        <p >{host}</p>
                    </div>
                    <div className='addToPlaylist-wrapper'>
                        <TextField
                            className='input-field'
                            label='Enter video url'
                            size='small'
                            value={tempVideoId2}
                            onChange={(e)=>setTempVideoId2(e.target.value)}
                        />
                        <Button className='load-btn' variant='outlined' onClick={()=>loadVideo2()}>load</Button>
                        <Button className='addToPlaylist-btn' variant='outlined' onClick={()=>addToPlaylist()}>queue</Button>
                    </div>
                </div>
                <div className='video-queue-wrapper'></div>
            </div>
            <div className='col3'>
                <div className='chat-box-wrapper'>
                    <ChatBox socket={getSocket()} height={videoHeight}></ChatBox>
                </div>
            </div>
        </div>
    )
}