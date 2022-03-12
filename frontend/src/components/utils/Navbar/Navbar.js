import './Navbar.scss';
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useHistory } from "react-router-dom";
import Avatar from '@mui/material/Avatar';

import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

export default function Navbar() {
    const history = useHistory();

    const redirectTo = (page) => {
        history.push(page);
    }

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event, page) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        redirectTo(page);
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
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div className='navbar'>
            <div className='col1'>
                <div className='title-header' onClick={()=>redirectTo('/')}>RecipeCentral</div>
            </div>
            <div className='col2'>
                <div className='home nav-item' onClick={()=>redirectTo('/')}>home</div>
                <div className='following nav-item' onClick={()=>redirectTo('/following')}>following</div>
                <div className='post-btn-wrapper nav-item'>
                    <button className='post-btn' onClick={()=>redirectTo('/post-recipe')}>post</button>
                </div>
                <div className='search-icon nav-item'><SearchIcon /></div>
                <div className='user-icon nav-item'>                
                    <Button
                    ref={anchorRef}
                    id="composition-button"
                    aria-controls={open ? 'composition-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    >
                    <Avatar alt='user' src='https://180dc.org/wp-content/uploads/2016/08/default-profile.png' />
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
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                                autoFocusItem={open}
                                id="composition-menu"
                                aria-labelledby="composition-button"
                                onKeyDown={handleListKeyDown}
                            >
                                <MenuItem onClick={(e)=>handleClose(e, 'profile')}>Profile</MenuItem>
                                <MenuItem onClick={(e)=>handleClose(e, 'settings')}>Settings</MenuItem>
                                <MenuItem onClick={(e)=>handleClose(e, 'logout')}>Logout</MenuItem>
                            </MenuList>
                            </ClickAwayListener>
                        </Paper>
                        </Grow>
                    )}
                    </Popper>
                </div>
            </div>
        </div>
    )
}