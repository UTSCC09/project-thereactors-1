import './UsersPanel.scss';
import React, { useEffect, useState } from "react";
import { Avatar } from '@mui/material';

export default function UsersPanel({usersData}) {

    return (
        <div className='users-panel'>
            <div className='header'>Users ({usersData.users.length})</div>
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