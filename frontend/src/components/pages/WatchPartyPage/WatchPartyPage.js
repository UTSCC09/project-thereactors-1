import './WatchPartyPage.scss';
import React, { useEffect } from "react";

export default function WatchPartyPage() {
    
    useEffect(() => {

    }, []);

    return (
        <div className="watch-party-page">
            <div className='col1'>
                <div className='desc-row'>
                    <div className='party-name'>Movie Night</div>
                </div>
                <div className='video-player-wrapper'></div>
                {/* <div className='video-player-wrapper'></div> */}
                <div className='video-queue-wrapper'></div>
            </div>
            <div className='col2'>
                <div className='connected-users-wrapper'></div>
                <div className='chat-box-wrapper'></div>
            </div>
        </div>
    )
}