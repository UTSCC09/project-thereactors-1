import './Navbar.scss';
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Avatar from '@mui/material/Avatar';

import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useLocation } from "react-router-dom";
import * as authAPI from 'auth/auth_utils.js';
import DarkModeToggle from './DarkModeToggle/DarkModeToggle';

import * as UserAPI from 'api/user';

export default function Navbar() {
    const history = useHistory();
    const location = useLocation();
    const [signedIn, setSignedIn] = useState(true);
    const [theme, setTheme] = useState('');
    const [avatar, setAvatar] = useState('https://180dc.org/wp-content/uploads/2016/08/default-profile.png');

    const redirectTo = (page) => {
        history.push(page);
    }

    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event, page) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        if (page === 'logout') {
            authAPI.signOut();
            redirectTo('/');
        } else if (page === 'settings') {
            if (location.pathname.includes('party')) {
                window.open('settings', '_blank');
            } else {
                redirectTo('settings');
            }
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    useEffect(() => {
        setSignedIn(authAPI.signedIn());
    }, [location]);

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });
    }, []);

    useEffect(() => {
        UserAPI.getAvatar(authAPI.getUser(), (avatar) => {
            setAvatar(avatar);
        });
    }, []);

    return (
        <div className={theme === 'dark' ? 'navbar-dark' : 'navbar'}>
            <div className='col1'>
                <div className='title-header' onClick={()=>redirectTo('/')}>YTWatchParty</div>
            </div>
            <div className='col2'>
                <div className='nav-item'><DarkModeToggle /></div>
                {!signedIn &&
                    <div className='post-btn-wrapper nav-item'>
                        <Button className='theme-btn' onClick={()=>redirectTo('/sign-in')} size='small'>sign in</Button>
                    </div>
                }
                {signedIn &&
                    <div className='user-wrapper nav-item'>
                        <div className='username'>{authAPI.getUser()}</div>
                        <Button
                        className='user-btn'
                        ref={anchorRef}
                        id="composition-button"
                        aria-controls={open ? 'composition-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        style={{backgroundColor: theme === 'dark' ? 'rgba(33, 33, 33, 0.98)' : 'white'}}
                        >
                        <Avatar className='user-icon' alt='user' src={avatar} />
                        </Button>
                        <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement="bottom-end"
                        transition
                        disablePortal
                        >
                        {({ TransitionProps, placement }) => (
                            <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom-end' ? 'left top' : 'left bottom',
                            }}
                            >
                            <Paper className={theme === 'dark' ? 'user-menu-dark' : ''}>
                                <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    <MenuItem className='menu-item' onClick={(e)=>handleClose(e, 'settings')}>Settings</MenuItem>
                                    <MenuItem className='menu-item' onClick={(e)=>handleClose(e, 'logout')}>Logout</MenuItem>
                                </MenuList>
                                </ClickAwayListener>
                            </Paper>
                            </Grow>
                        )}
                        </Popper>
                    </div>
                }
            </div>
        </div>
    )
}