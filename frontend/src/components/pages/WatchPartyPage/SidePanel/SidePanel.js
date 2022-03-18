import './SidePanel.scss';
import React, { useEffect, useState } from "react";
import PlaylistPanel from './PlaylistPanel/PlaylistPanel';
import UsersPanel from './UsersPanel/UsersPanel';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import GroupIcon from '@mui/icons-material/Group';

const PLAYLIST_TYPE = 0;
const USERS_TYPE = 1;

export default function SidePanel() {
    const [panelType, setPanelType] = useState(PLAYLIST_TYPE);

    const sidePanel = document.getElementById('sidePanel');
    const openPlaylistBtn = document.getElementById("openPlaylistBtn");
    const openUsersBtn = document.getElementById("openUsersBtn");

    const closePanel = () => {
        setPanelType(-1);
        sidePanel.style.width = 0;
    }
    
    const openPanel = (type) => {
        setPanelType(type);
        sidePanel.style.width = "18%";

        if (type === PLAYLIST_TYPE) {
            document.onclick = (e) => {
                if (!sidePanel.contains(e.target) && !openPlaylistBtn.contains(e.target)) {
                    closePanel();
                }
            }
        } else {
            document.onclick = (e) => {
                if (!sidePanel.contains(e.target) && !openUsersBtn.contains(e.target)) {
                    closePanel();
                }
            }
        }
    }
    
    return (
        <>
            <div id='openPlaylistBtn' className='playlist-icon icon-btn' onClick={()=>openPanel(PLAYLIST_TYPE)}>
                <PlaylistPlayIcon />
            </div>
            <div id='openUsersBtn' className='users-icon icon-btn' onClick={()=>openPanel(USERS_TYPE)}>
                <GroupIcon />
            </div>
            <div id="sidePanel" className="side-panel">
                {panelType !== -1 && panelType === PLAYLIST_TYPE &&
                    <PlaylistPanel />
                }
                {panelType !== -1 && panelType === USERS_TYPE &&
                    <UsersPanel />
                }
            </div>
        </>
    )
}