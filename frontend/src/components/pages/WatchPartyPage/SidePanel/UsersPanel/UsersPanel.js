import './UsersPanel.scss';
import React, { useEffect, useState } from "react";
import { Avatar } from '@mui/material';

export default function UsersPanel({usersData}) {
    const [users, setUsers] = useState(usersData.users);
    const [host, setHost] = useState(usersData.host);

    useEffect(() => {
        let temp = users.filter(user => user !== host);
        setUsers([host, temp]);
    }, [])

    return (
        <div className='users-panel'>
            <div className='header'>Users ({users.length})</div>
            {users?.length > 0 &&
                users.map((user, index) => {
                    return (
                        <div key={index} className='user-wrapper'>
                        <Avatar className='icon' />
                        <div className='username'>{user} 
                            {user === host && <span> (host)</span>}
                        </div>
                        </div>
                    )
                })
            }
        </div>
    )
}