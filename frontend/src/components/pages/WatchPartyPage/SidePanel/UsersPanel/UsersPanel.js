import './UsersPanel.scss';
import React, { useEffect, useState } from "react";
import { Avatar, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getSocket } from 'components/utils/socket_utils';
import { getUser } from 'auth/auth_utils';

export default function UsersPanel({usersData, setCloseIcon}) {
    const [theme, setTheme] = useState('');

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });

        setCloseIcon(document.getElementById('close-icon'));
    }, [])

    const passRemote = (newUser) => {
        getSocket().emit('host-change', newUser);
    }

    const getRemote = () => {
        getSocket().emit('get-remote');
    }

    const getClass = () => {
        if (getUser() === usersData.host || getUser() === usersData.originalHost) {
            return theme === 'dark' ? 'user-wrapper-host user-wrapper-host-dark' : 'user-wrapper-host';
        }
        return 'user-wrapper';
    }

    return (
        <div className='users-panel'>
            <div className='header'>
                Users ({usersData.users.length})
                <ArrowBackIosNewIcon id='close-icon' />
            </div>
            
            {usersData.users?.length > 0 &&
                usersData.users.map((user, index) => {
                    return (
                        <div key={index} className={getClass()}>
                            <div className='user-wrapper-col1'>
                            <Avatar src={user.avatar} className='icon' />
                            <div className='username'>{user.username} 
                                {user.username === usersData.host &&
                                    user.username !== usersData.originalHost && 
                                    <span> (host)</span>
                                }
                                {user.username !== usersData.host && 
                                    user.username === usersData.originalHost &&
                                    <span> (owner)</span>
                                }
                                {user.username === usersData.host && 
                                    user.username === usersData.originalHost &&
                                    <span> (owner, host)</span>
                                }
                            </div>
                            </div>
                            {getUser() === usersData.host && user.username !== usersData.host && 
                                <div className='user-wrapper-col2'>
                                    <Button 
                                        size='small' 
                                        className='pass-remote-btn'
                                        onClick={()=>passRemote(user.username)}
                                    >
                                        pass remote
                                    </Button>
                                </div>
                            }
                            {getUser() === usersData.originalHost && user.username === usersData.originalHost &&
                                user.username !== usersData.host && 
                                <div className='user-wrapper-col2'>
                                    <Button 
                                        size='small' 
                                        className='pass-remote-btn'
                                        onClick={()=>getRemote(user.username)}
                                    >
                                        get remote
                                    </Button>
                                </div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}