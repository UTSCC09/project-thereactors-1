import './UsersPanel.scss';
import React, { useEffect, useState } from "react";
import { Avatar, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getSocket } from 'components/utils/socket_utils';
import { getUser } from 'auth/auth_utils';

export default function UsersPanel({usersData, setCloseIcon}) {

    useEffect(() => {
        setCloseIcon(document.getElementById('close-icon'));
    }, [])

    const passRemote = (newUser) => {
        getSocket().emit('host-change', newUser);
    }

    const getRemote = () => {
        getSocket().emit('get-remote');
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
                        <div key={index} className='user-wrapper'>
                            <div className='user-wrapper-col1'>
                            <Avatar className='icon' />
                            <div className='username'>{user} 
                                {user === usersData.host &&
                                    user !== usersData.originalHost && 
                                    <span> (host)</span>
                                }
                                {user !== usersData.host && 
                                    user === usersData.originalHost &&
                                    <span> (owner)</span>
                                }
                                {user === usersData.host && 
                                    user === usersData.originalHost &&
                                    <span> (owner, host)</span>
                                }
                            </div>
                            </div>
                            {getUser() === usersData.host && user !== usersData.host && 
                                <div className='user-wrapper-col2'>
                                    <Button 
                                        size='small' 
                                        className='pass-remote-btn'
                                        onClick={()=>passRemote(user)}
                                    >
                                        pass remote
                                    </Button>
                                </div>
                            }
                            {getUser() === usersData.originalHost && user === usersData.originalHost &&
                                user !== usersData.host && 
                                <div className='user-wrapper-col2'>
                                    <Button 
                                        size='small' 
                                        className='pass-remote-btn'
                                        onClick={()=>getRemote(user)}
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