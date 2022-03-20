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
import * as authAPI from 'auth/auth_utils.js';
import { getSocket } from 'components/utils/socket_utils';
import SidePanel from './SidePanel/SidePanel';
import * as videoUtils from 'components/utils/video_utils';

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
    const [playerRefValid,setPlayerRefValid] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [muted, setMuted] = useState(true);
    // custom states 
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [host, setHost] = useState('');
    const [videoPlayedSeconds,setVideoPlayedSeconds] = useState(0);
    const [videoIsPlaying,setVideoIsPlaying] = useState(true); 
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
        } else{
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

        getSocket().on('user-left', (users) => {
            setConnectedUsers(users);
        })
    }, []);

    // useEffect(()=> {
    //     // playlist and video updates handling 
    //     getSocket().on('update-progress',(party_video_state)=> {
    //         handleUpdateProgress(party_video_state);
    //     });
    // },[playerRefValid]);
    // handle video and playlist events

    const play = () => {
        if(playerRefValid) {
            if(host === authAPI.getUser()) {
                getSocket().emit('play-video');
            } else {
                setPlaying(true)
                setPlaying(videoIsPlaying);
                // console.log("play  "+ videoIsPlaying);
            }
        }

        // sync with all users
    }

    const pause = () => {
        if(playerRefValid) {
            if(host === authAPI.getUser()) {
                getSocket().emit('pause-video', playerRef.current.getCurrentTime());
            } else {
                // console.log("pause "+ videoIsPlaying);
                setPlaying(false)
                setPlaying(videoIsPlaying);
            }
        }
        

        // sync with all users
    }

    const addToPlaylist = (url, type) => {
        if (host === authAPI.getUser()) {
            setTempVideoId('');
            setTempVideoId2('');
            if (ReactPlayer.canPlay(url) && videoUtils.isYtLink(url)) {
                let obj = {title: "", link: videoUtils.getValidLink(url), thumbnail: videoUtils.getVideoThumbnail(url)};
                videoUtils.getVideoTitle(url).then(res => {
                    obj.title = res;
                    if (type === 'queue') {
                        getSocket().emit('update-playlist',[...playlist,obj])
                    } else {
                        getSocket().emit('load-playlist',[...playlist,obj])
                    }
                })
            }
        }
    }

    const handleOnReady = () => {
        console.log("ready");
        setPlayerRefValid(true);
        setVideoReady(true);
        console.log(playerRefValid);
        // setPlaying(party_video_state.video_is_playing);
        // playerRef.current.seekTo(party_video_state.playedSeconds);
        console.log("ready done");

    }
    const handleOnBufferEnd = () => {
        // check if state of video should be playing
    }
    const handleOnEnded = () => {
        // check if state of video should be playing
        if(host === authAPI.getUser()) {
            getSocket().emit('video-ended');
            if (playlist_index < playlist.length - 1) {
                getSocket().emit('update-index', playlist_index + 1);
            }
        }
    }
    const handleVideoProgress = (progress) => {
        // party_video_state.playedSeconds = progress.playedSeconds;
        // use host's current video playtime to sync with other users
        // to make it seems like everyone is watching at the same time.
        // i.e, if other users stop their video, once they resume it, we 
        // will use the host's current video playtime to make them catch up.
        console.log("progress")
        console.log(playerRefValid);
        if(host === authAPI.getUser()) {
            // console.log('progress', progress.playedSeconds);
            getSocket().emit('update-video-progress', progress.playedSeconds);
        }
        // setMuted(false);
    }

    // handle socket events
    const handleUpdateProgress= (new_party_video_state)=> {
        // console.log('old video state ' + playing + " " + videoPlayedSeconds);
        console.log(" new video state")
        // console.log(new_party_video_state)
        setVideoPlayedSeconds(new_party_video_state.playedSeconds);
        setVideoIsPlaying(new_party_video_state.video_is_playing);
        // console.log(playerRef.current );
        console.log(playerRefValid);
        if(playerRef.current ) {
            console.log("here1");
            setPlaying(new_party_video_state.video_is_playing);
            // console.log("here2.6");
            if(Math.abs(playerRef.current.getCurrentTime() - new_party_video_state.playedSeconds) > .5) {
                // console.log("here3");
                playerRef.current.seekTo(new_party_video_state.playedSeconds);
                // console.log("here4");
            }
      
            // console.log("here5");
        }
    }

    const handlePlayListChange= (data)=> {
        setPlaylist(data.playlist);
        setPlaylistIndex(data.current_vid);

        if(data.current_vid < 0 || data.current_vid >= data.playlist.length) {
            setVideoId('');
        } else {
            if( videoId === ''  ||data.playlist[data.current_vid] !== videoId)
                setVideoId(data.playlist[data.current_vid].link);
        }

    }

    const getUsersRightOrder = (users) => {
        let temp = users.filter(user => user !== host);
        return [host].concat(temp);
    }

    return (
        <div className="watch-party-page">
            <div className='col1'>
                <SidePanel 
                    playlistData={{playlist:playlist, currentIdx:playlist_index, host:host}}
                    usersData={{users:getUsersRightOrder(connectedUsers), host:host}}
                />
            </div>
            <div className='col2'>
                <div id='video-player-wrapper' className='video-player-wrapper'>
                    {videoId !== '' && videoWidth !== '' && videoHeight !== '' &&
                        <ReactPlayer 
                            ref ={(player)=> {playerRef.current = player}}
                            url={videoId}
                            controls={controls}
                            playing={playing}
                            onProgress={handleVideoProgress}
                            onPlay={play}
                            onPause={pause}
                            width={videoWidth}
                            height={videoHeight}
                            onReady={handleOnReady}
                            // onBufferEnd={handleOnBufferEnd}
                            onEnded={handleOnEnded}
                            muted={muted}
                            // volume={0.4}
                        />
                    }
                    {videoId === '' && 
                        <div className='add-video-wrapper' style={{height: videoHeight, width: videoWidth}}>
                            {authAPI.getUser() === host &&
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
                                <Button type='submit' className='load-btn' variant='outlined' onClick={()=>addToPlaylist(tempVideoId, 'load')}>load</Button>
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className='desc-row'>
                    <div className='host'>
                        <span style={{marginRight: 4}}>Host:</span>
                        <Avatar  style={{marginRight: 4}} title={host} className='host-icon' />
                        <p >{host}</p>
                    </div>
                    {authAPI.getUser() === host &&
                        <div className='addToPlaylist-wrapper'>
                            <TextField
                                className='input-field'
                                label='Enter video url'
                                size='small'
                                value={tempVideoId2}
                                onChange={(e)=>setTempVideoId2(e.target.value)}
                            />
                            <Button className='load-btn' variant='outlined' onClick={()=>addToPlaylist(tempVideoId2, 'load')}>load</Button>
                            <Button className='addToPlaylist-btn' variant='outlined' onClick={()=>addToPlaylist(tempVideoId2, 'queue')}>queue</Button>
                        </div>
                    }
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