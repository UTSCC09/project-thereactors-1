import './WatchPartyPage.scss';
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from 'react-player';
import { Avatar, Button, TextField } from '@mui/material';
import ChatBox from "./ChatBox/ChatBox";
import * as authAPI from 'auth/auth_utils.js';
import { getSocket, disconnectSocket } from 'components/utils/socket_utils';
import SidePanel from './SidePanel/SidePanel';
import * as videoUtils from 'components/utils/video_utils';
import uuid from 'react-uuid';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useHistory } from 'react-router-dom'
import VoiceCall from './VoiceCall/VoiceCall';
import * as UserAPI from 'api/user';

import { styled } from '@mui/system';
import SwitchUnstyled, { switchUnstyledClasses } from '@mui/base/SwitchUnstyled';

const blue = {
    500: '#007FFF',
  };
  
  const grey = {
    400: '#BFC7CF',
    500: '#AAB4BE',
    600: '#6F7E8C',
  };
  
  const Root = styled('span')(
    ({ theme }) => `
    font-size: 0;
    position: relative;
    display: inline-block;
    width: 35px;
    height: 20px;
    margin-right: 24px;
    cursor: pointer;
  
    &.${switchUnstyledClasses.disabled} {
      opacity: 0.4;
      cursor: not-allowed;
    }
  
    & .${switchUnstyledClasses.track} {
      background: ${theme.palette.mode === 'dark' ? grey[600] : grey[400]};
      border-radius: 10px;
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
    }
  
    & .${switchUnstyledClasses.thumb} {
      display: block;
      width: 14px;
      height: 14px;
      top: 3px;
      left: 3.5px;
      border-radius: 16px;
      background-color: #fff;
      position: relative;
      transition: all 200ms ease;
    }
  
    &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
      background-color: ${grey[400]};
      box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
    }
  
    &.${switchUnstyledClasses.checked} {
      .${switchUnstyledClasses.thumb} {
        left: 18px;
        top: 3px;
        background-color: #fff;
      }
  
      .${switchUnstyledClasses.track} {
        background: ${blue[500]};
      }
    }
  
    & .${switchUnstyledClasses.input} {
      cursor: inherit;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 1;
      margin: 0;
    }
    `,
  );
  

export default function WatchPartyPage() {
    // these are react-player states
    const history = useHistory() 
    const [videoId, setVideoId] = useState('');
    const [tempVideoId, setTempVideoId] = useState('');
    const [tempVideoId2, setTempVideoId2] = useState('');
    const [playing, setPlaying] = useState(false);
    const [controls, setControls] = useState(true);
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    const playerRef = useRef();
    const maxvideosyncdiff = .5;
    const [muted, setMuted] = useState(true);

    /**
     * party_video_states:
     *  - playedSeconds
     *  - video_is_playing
     */
    // custom states 
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [host, setHost] = useState('');
    const [videoIsPlaying, setVideoIsPlaying] = useState(false); 
    const [playlist, setPlaylist] = useState([]);
    const [playlist_index, setPlaylistIndex] = useState(0);
    const [originalHost, setOriginalHost] = useState('');
    const [theme, setTheme] = useState('');
    const emoteSize = 60;
    const emoteList = [
        '1f970','1f60d','263a','1f92d','1f604','1f633','1f97a','1f972','1f637',
        '1f628','1f618','1f630','1f4a9','1f649','1f643','1f636','1f97a','1f602',
        '1f631','1f4a9','1f494','2764','2763','1f31a','1f608','1f624','2697',
        '2734','1f4a3'
    ];
    const [emoteListInnerHeight, setEmoteListInnerHeight] = useState(0);
    const [messages, setMessages] = useState([]);
    const label = { componentsProps: { input: { 'aria-label': 'Demo switch' } } };

    useEffect(() => {
        return history.listen(() => { 
            disconnectSocket();
        }) 
     },[history]);

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });

        const vidWrapperBox = document.getElementById('video-player-wrapper').getBoundingClientRect();
        setVideoWidth(vidWrapperBox.width);
        setVideoHeight((vidWrapperBox.width / 16) * 9);

        const emoteListEl = document.querySelector('.emote-list-wrapper').getBoundingClientRect();
        setEmoteListInnerHeight(emoteListEl.width);

        window.onresize = () => {
            const vidWrapperBox1 = document.getElementById('video-player-wrapper').getBoundingClientRect();
            setVideoWidth(vidWrapperBox1.width);
            setVideoHeight((vidWrapperBox1.width / 16) * 9);

            const emoteListEl1 = document.querySelector('.emote-list-wrapper').getBoundingClientRect();
            setEmoteListInnerHeight(emoteListEl1.width);
        }

        if (new URLSearchParams(window.location.search).get("id")) {
            if (authAPI.signedIn())
                getSocket().emit('join-room', { roomname: new URLSearchParams(window.location.search).get("id")});
            else 
                window.location.href= '/join?id='+ new URLSearchParams(window.location.search).get("id");
        } else {
            window.location.href = '/join';
        }
        getSocket().off('connect');
        getSocket().off('curr_users');
        getSocket().off('host');
        getSocket().off('original-host');
        getSocket().off('password-missing');
        getSocket().off('update-progress');
        getSocket().off('playlist-changed');
        getSocket().off('emote');
        getSocket().off('user-left');

        getSocket().on('connect', () => {
           getSocket().emit('rejoin-room', { roomname: new URLSearchParams(window.location.search).get("id")});
        });
        getSocket().on('curr_users',(usernames)=> {
            let tempUsers = [];
            usernames.forEach((name, index) => {
                let temp = {username: name};
                UserAPI.getAvatar(name, (avatar) => {
                    temp.avatar = avatar;
                    tempUsers.push(temp);
                    if (index === usernames.length - 1) {
                        setConnectedUsers(tempUsers);
                    }
                });
            });       
        });

        getSocket().on('host',(host)=> {
            setHost(host);
        });
        
        getSocket().on('original-host',(originalHost)=> {
            setOriginalHost(originalHost);
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

        getSocket().on('user-left', (data) => {
            if (data.host !== "") {
                setHost(data.host);
            }
            let tempUsers = [];
            if(data.users) {
                data.users.forEach((name, index) => {
                    let temp = {username: name};
                    UserAPI.getAvatar(name, (avatar) => {
                        temp.avatar = avatar;
                        tempUsers.push(temp);
                        if (index === data.users.length - 1) {
                            setConnectedUsers(tempUsers);
                        }
                    });
                });
            }
        })

        getSocket().on('emote', (data) => {
            displayEmote({dispId:uuid(), id: data.emote_code, x: data.x, y: data.y})
        })
        getSocket().on("receive",data => {
            setMessages(msgs=>[...msgs,data]);
        });
        getSocket().on("joined",chat_history => {
            setMessages(()=>[...chat_history]);
        });

        if (authAPI.signedIn()){
            getSocket().emit('join-room', { roomname: new URLSearchParams(window.location.search).get("id")});
        }
    }, []);


    const handleOnStart = () => {
        playerRef.current.seekTo(0);
        if (host === authAPI.getUser()) {
            getSocket().emit('update-video-progress', 0);
        }
    }

    // handle when user clicks the play button
    const play = () => {
        if(playerRef.current) {
            if(host === authAPI.getUser()) {
                getSocket().emit('play-video');
            } else {
                setPlaying(true)
                setPlaying(videoIsPlaying);
            }
        }
    }

    const pause = () => {
        if(playerRef.current) {
            if(host === authAPI.getUser()) {
                getSocket().emit('pause-video', playerRef.current.getCurrentTime());
            } else {
                setPlaying(false)
                setPlaying(videoIsPlaying);
            }
        }
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

    // called when video finiishes, then host changes the video
    const handleOnEnded = () => {
        if(host === authAPI.getUser()) {
            if (playlist_index < playlist.length - 1) {
                getSocket().emit('update-index', playlist_index + 1);
            } else {
                getSocket().emit('pause-video', playerRef.current.getCurrentTime());
            }
        }
    }

    // called by the player when progress is updates
    const handleVideoProgress = (progress) => {
        // use host's current video playtime to sync with other users
        // to make it seems like everyone is watching at the same time.
        // i.e, if other users stop their video, once they resume it, we 
        // will use the host's current video playtime to make them catch up.
        if(host === authAPI.getUser()) {
            getSocket().emit('update-video-progress', progress.playedSeconds);
        }
    }

    // handle call from socket to update the video progress
    const handleUpdateProgress= (new_party_video_state)=> {
        setVideoIsPlaying(new_party_video_state.video_is_playing);
        if(playerRef.current) {
            setPlaying(new_party_video_state.video_is_playing);
            // sync video if time is greater than some margin
            if(Math.abs(playerRef.current.getCurrentTime() - new_party_video_state.playedSeconds) > maxvideosyncdiff) {
                playerRef.current.seekTo(new_party_video_state.playedSeconds);
            }
        }
    }

    // handle call from socket to update the playlist 
    const handlePlayListChange= (data)=> {
        setPlaylist(data.playlist);
        setPlaylistIndex(data.current_vid);

        if (data.current_vid < 0 || data.current_vid >= data.playlist.length) {
            setVideoId('');
        } else {
            if (videoId === ''  || data.playlist[data.current_vid].link !== videoId) {
                setVideoId(data.playlist[data.current_vid].link);
            }
        }
    }
    
    const getUsersRightOrder = (users) => {
        let rest = users.filter(user => user.username !== host);
        let avatar;
        if (users[users.findIndex(user => user.username === host)]){
             avatar = users[users.findIndex(user => user.username === host)].avatar
        }
        let tempHost = {username: host, avatar: avatar };
        return [tempHost].concat(rest);
    }

    const displayEmote = (emote) => {
        let emoteToggleEl = document.getElementById('emoteToggle').lastElementChild;
        if (emoteToggleEl.checked) {
            let padding = 20;
            let vidWrapperBox = document.getElementById('video-player-wrapper').getBoundingClientRect();
            let video_X = vidWrapperBox.width;
            let video_Y = (vidWrapperBox.width / 16) * 9;
            let max_X = video_X - (emoteSize + padding);
            let max_Y = video_Y - (emoteSize + padding);
            let emote_X = emote.x * max_X;
            let emote_Y = emote.y * max_Y;
            emote_X = emote_X < padding ? padding : emote_X;
            emote_Y = emote_Y < padding ? padding : emote_Y;
            let emotesEl = document.getElementById('video-player-wrapper');
            let div = document.createElement('div');
            div.setAttribute('id', `emote-${emote.dispId}`);
            div.setAttribute('class', 'emote');
            div.style.transition = 'opacity .3s';
            div.style.opacity = '1';
            div.style.margin = `${emote_Y}px 0 0 ${emote_X}px`;
            let img = document.createElement('img');
            img.setAttribute('src', `https://emojiapi.dev/api/v1/${emote.id}/${emoteSize}.png`);
            div.append(img);
            emotesEl.prepend(div);
            setTimeout(() => {
                let emoteEl = document.getElementById(`emote-${emote.dispId}`);
                emoteEl.style.transition = 'opacity 2.5s';
                emoteEl.style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('video-player-wrapper').removeChild(emoteEl);
                }, 2500);
            }, 700);
        }
    }

    const sendEmote = (id) => {
        getSocket().emit('emote', id);
    }

    const [emotesHidden, setEmotesHidden] = useState(true);
    const slideEmotes = () => {
        const emoteListEl = document.querySelector('.emote-list-wrapper');
        const toggleEl = document.querySelector('#emote-toggle');
        const arrowEl = document.querySelector('.left-arrow-icon');
        if (emotesHidden) {
            setEmotesHidden(false);
            emoteListEl.style.transform = 'translateX(0)';
            setTimeout(() => {
                toggleEl.style.borderRadius = '0px 10px 10px 0px';
                arrowEl.style.transform = 'rotate(180deg)';
            }, 300);
        } else {
            setEmotesHidden(true);
            emoteListEl.style.transform = 'translateX(101%)';
            toggleEl.style.borderRadius = '10px 0px 0px 10px';
            arrowEl.style.transform = 'rotate(360deg)';
        }
    }

    const handleEmoteToggle = (e) => {
        if (e.target.checked) {
            let emotesEl = document.querySelectorAll('.emote-disabled');
            emotesEl.forEach((el) => {
                el.setAttribute('class', 'emote');
            });
        } else {
            let emotesEl = document.querySelectorAll('.emote');
            emotesEl.forEach((el) => {
                el.setAttribute('class', 'emote-disabled');
            });
        }
    }

    const getAvatar = (username) => {
        if(connectedUsers[connectedUsers.findIndex(user => user.username === username)]) {
            return connectedUsers[connectedUsers.findIndex(user => user.username === username)].avatar;
        } else {
            return '';
        }
    }

    return (
        <div className="watch-party-page">
            <div className='col1'>
                {connectedUsers?.length > 0 && host !== '' &&
                    <SidePanel 
                        playlistData={{playlist:playlist, currentIdx:playlist_index, host:host}}
                        usersData={{users:getUsersRightOrder(connectedUsers), host:host, originalHost:originalHost}}
                    />
                }
                {videoHeight !== 0 &&
                    <VoiceCall videoHeight={videoHeight} />
                }
            </div>
            <div className='col2'>
                <div id='video-player-wrapper' className='video-player-wrapper'>
                    {videoId !== '' && videoWidth !== 0 && videoHeight !== 0 &&
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
                            onStart={handleOnStart}
                            onEnded={handleOnEnded}
                            muted={muted}
                        />
                    }
                    {videoId === '' && 
                        <div className='add-video-wrapper' style={{height: videoHeight, width: videoWidth}}>
                            {authAPI.getUser() === host &&
                                <div className='inner-wrapper'>
                                <TextField 
                                    className={theme === 'dark' ? 'textfield-dark' : ''}
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
                        {connectedUsers?.length > 0 && host !== '' &&
                            <>
                            <Avatar src={getAvatar(host)} style={{marginRight: 4}} title={host} className='host-icon' />
                            <p>{host}</p>
                            </>
                        }
                    </div>
                    <div className='desc-row-col2'>
                    <div className='emote-toggle'>
                        <div style={{marginRight:6}}>emote</div>
                        <SwitchUnstyled id="emoteToggle" component={Root} {...label} defaultChecked onClick={(e)=>handleEmoteToggle(e)} />
                    </div>
                    {authAPI.getUser() === host &&
                        <div className='addToPlaylist-wrapper'>
                            <TextField
                                className={theme === 'dark' ? 'input-field textfield-dark' : 'input-field'}
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
                </div>
                <div className='video-queue-wrapper'></div>
            </div>
            <div className='col3'>
                <div className='chat-box-wrapper'>
                    {connectedUsers?.length > 0 &&
                        <ChatBox height={videoHeight} users={connectedUsers} messages={messages}></ChatBox>
                    }
                </div>
                <div className='emote-list-toggle-wrapper'>
                <div className='emote-list-wrapper'>
                    <div className='emote-list-inner-wrapper' style={{height: emoteListInnerHeight}}>
                    {emoteList.map((id, index) => {
                        return (
                            <Button key={index} className='emote-btn' onClick={()=>sendEmote(id)}>
                                <img className='emote-img' src={`https://emojiapi.dev/api/v1/${id}/${emoteSize}.png`}/>
                            </Button>
                        )
                    })}
                    </div>
                </div>
                <Button variant='outlined' id='emote-toggle' className={theme === 'dark' ? 'emote-toggle-dark' : 'emote-toggle'} onClick={()=>slideEmotes()}>
                    <div className='left-arrow'><ArrowLeftIcon className='left-arrow-icon' /></div>
                    <div className='emote-text'>emote</div>
                </Button>
                </div>
            </div>
            <div className={theme === 'dark' ? 'padding-col-dark' : 'padding-col'}></div>
        </div>
    )
}
