import './JoinPartyPage.scss';
import React, { useEffect, useState } from "react";
import { 
    Button,
    TextField 
} from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";

export default function JoinPartyPage() {
    const [partyId, setPartyId] = useState('');
    const [partyName, setPartyName] = useState('');
    const [partyCode, setPartyCode] = useState('');
    const [partyUsername, setPartyUsername] = useState('');
    const [alreadyHasId, setAlreadyHasId] = useState(false);
    const location = useLocation();
    const history = useHistory();
    
    const getParty = (id) => {
        // api call
        if (id !== null) {
            setPartyId(id)
            setPartyName(String(id))
            setAlreadyHasId(true)
        }
    }

    const joinRoom = (e, id, code, username) => {
        e.preventDefault();
        console.log(id, code, username);
        setPartyId('');
        setPartyName('');
        setPartyCode('');
        setPartyUsername('');
        // redirect to generated room
        history.push('party?id='+id);
    }

    useEffect(() => {
        const search = location.search;
        const partyId = new URLSearchParams(search).get('id'); 
        getParty(partyId);
    }, []);

    return (
        <div className='join-party-page'>
            <div className='content-box'>
                {alreadyHasId &&
                    <div className='header1'>Joining Party "{partyName}"</div>
                }
                {!alreadyHasId &&
                    <div className='header1'>Join Party</div>
                }
                <div className='inputs-btn-box'>
                <form id='party-form' onSubmit={(e)=>joinRoom(e, partyId, partyCode, partyUsername)}>
                <div className='inputs-box'>
                {!alreadyHasId &&
                    <TextField 
                        className='textfield'
                        size='small'
                        label='Party ID'
                        value={partyId}
                        onChange={(e)=>setPartyId(e.target.value)}
                        required
                    >
                    </TextField>
                }
                <TextField 
                    className='textfield'
                    size='small'
                    label='Party code'
                    value={partyCode}
                    onChange={(e)=>setPartyCode(e.target.value)}
                    required
                >
                </TextField>
                <TextField 
                    className='textfield'
                    size='small'
                    label='Party username'
                    value={partyUsername}
                    onChange={(e)=>setPartyUsername(e.target.value)}
                    required
                >
                </TextField>
                </div>
                <Button type='submit' className='btn'  variant='outlined' size='small'>join</Button>
                </form>
                </div>
            </div>
        </div>
    )
}