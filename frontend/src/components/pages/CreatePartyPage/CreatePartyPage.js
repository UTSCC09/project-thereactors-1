import './CreatePartyPage.scss';
import React, { useEffect, useState } from "react";
import { 
    Button,
    TextField 
} from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";

export default function JoinPartyPage() {
    const [partyCode, setPartyCode] = useState('');
    const [partyUsername, setPartyUsername] = useState('');
    const [alreadyHasId, setAlreadyHasId] = useState(false);
    const history = useHistory();
    
    const createRoom = (e, code, username) => {
        e.preventDefault();
        setPartyCode('');
        // redirect to generated room
        
        history.push('party?id=');
    }

    return (
        <div className='join-party-page'>
            <div className='content-box'>
                <div className='header1'>Create Party</div>
                <div className='inputs-btn-box'>
                <form id='party-form' onSubmit={(e)=>createRoom(e, partyCode, partyUsername)}>
                <div className='inputs-box'>
                <TextField 
                    className='textfield'
                    size='small'
                    label='Set party password'
                    value={partyCode}
                    onChange={(e)=>setPartyCode(e.target.value)}
                    required
                >
                </TextField>
                <TextField 
                    className='textfield'
                    size='small'
                    label='Enter your nickname'
                    value={partyUsername}
                    onChange={(e)=>setPartyUsername(e.target.value)}
                    required
                >
                </TextField>
                </div>
                <Button type='submit' className='btn'  variant='outlined' size='small'>create</Button>
                </form>
                </div>
            </div>
        </div>
    )
}