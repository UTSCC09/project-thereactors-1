import './WatchPartyPage.scss';
import React, { useEffect, useState } from "react";
import ReactPlayer from 'react-player';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Button, TextField } from '@mui/material';
import ChatBox from "./ChatBox/ChatBox";
import io from 'socket.io-client';
import config from 'environments';

const socket = io.connect(config.backendUrl);
socket.emit('join-room',"blah");

export default function WatchPartyPage() {
    const [videoId, setVideoId] = useState('');
    const [tempVideoId, setTempVideoId] = useState('');
    const [playing, setPlaying] = useState(false);
    const [controls, setControls] = useState(true);
    const [videoWidth, setVideoWidth] = useState(0);
    const [videoHeight, setVideoHeight] = useState(0);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [host, setHost] = useState('user1');
    
    useEffect(() => {
        const vidWrapperBox = document.getElementById('video-player-wrapper').getBoundingClientRect();
        setVideoWidth(vidWrapperBox.width);
        setVideoHeight((vidWrapperBox.width / 16) * 9);

        window.onresize = () => {
            const vidWrapperBox1 = document.getElementById('video-player-wrapper').getBoundingClientRect();
            setVideoWidth(vidWrapperBox1.width);
            setVideoHeight((vidWrapperBox1.width / 16) * 9);
        }

        setConnectedUsers(
            [
                "user1",
                "user2",
                "user3",
                "user4",
            ]
        )
    }, []);

    const play = () => {
        setPlaying(true);
        console.log('play')

        // sync with all users
    }

    const pause = () => {
        setPlaying(false);
        console.log('paused')

        // sync with all users
    }

    const handleVideoProgress = (progress) => {
        console.log('progress', progress);

        // use host's current video playtime to sync with other users
        // to make it seems like everyone is watching at the same time.
        // i.e, if other users stop their video, once they resume it, we 
        // will use the host's current video playtime to make them catch up.
    }

    const loadVideo = (e) => {
        e.preventDefault();
        setVideoId(tempVideoId);
    }

    return (
        <div className="watch-party-page">
            <div className='col1'>
                <div className='desc-row'>
                    <div className='party-name'>Movie Night</div>
                    <div className='host'>
                        <span style={{marginRight: 4}}>host:</span>
                        <Avatar title={host} className='host-icon' />
                    </div>
                </div>
                <div id='video-player-wrapper' className='video-player-wrapper'>
                    {videoId !== '' && videoWidth !== '' && videoHeight !== '' &&
                        <ReactPlayer 
                            url={videoId}
                            controls={controls}
                            playing={playing}
                            onProgress={handleVideoProgress}
                            onPlay={play}
                            onPause={pause}
                            width={videoWidth}
                            height={videoHeight}
                        />
                    }
                    {videoId === '' &&
                        <div className='add-video-wrapper' style={{height: videoHeight, width: videoWidth}}>
                            <form className='inner-wrapper' onSubmit={(e)=>loadVideo(e)}>
                            <TextField 
                                label="Enter video url"
                                size='small'
                                style={{
                                    marginRight: 5,
                                    width: '100%'
                                }}
                                onChange={(e)=>setTempVideoId(e.target.value)}
                            />
                            <Button type='submit' variant='outlined'>load</Button>
                            </form>
                        </div>
                    }
                </div>
                <div className='video-queue-wrapper'></div>
            </div>
            <div className='col2'>
                <div className='connected-users-wrapper'>
                    <Accordion className='Accordion'>
                        <AccordionSummary
                            className='AccordionSummary'
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                        <Typography>Connected Users</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                padding: '0 16px 10px'
                            }}
                        >
                            {connectedUsers?.length > 0 &&
                                connectedUsers.map((user, index) => {
                                    return (
                                        <div key={index} className='user'>{user}</div>
                                    )
                                })
                            }
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className='chat-box-wrapper' style={{minHeight: videoHeight}}>
                    <ChatBox socket={socket}></ChatBox>
                </div>
            </div>
        </div>
    )
}