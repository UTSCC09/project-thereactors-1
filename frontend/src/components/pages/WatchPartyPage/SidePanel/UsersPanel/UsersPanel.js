import './UsersPanel.scss';
import React, { useEffect, useState } from "react";
import { Avatar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function UsersPanel({usersData, setCloseIcon}) {

    useEffect(() => {
        setCloseIcon(document.getElementById('close-icon'));
    }, [])

    return (
        <div className='users-panel'>
            <div className='header'>
                Users ({usersData.users.length})
                <ArrowBackIosNewIcon id='close-icon' />
            </div>
            
            {usersData.users?.length > 0 &&
                usersData.users.map((user, index) => {
                    return (
                        <div key={index} className='user-wrapper'>
                        <Avatar className='icon' />
                        <div className='username'>{user} 
                            {user === usersData.host && <span> (host)</span>}
                        </div>
                        </div>
                    )
                })
            }
        </div>
    )
}