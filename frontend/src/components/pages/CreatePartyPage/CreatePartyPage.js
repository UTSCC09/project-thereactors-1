import './CreatePartyPage.scss';
import React, { useEffect, useState } from "react";
import { 
    Button,
    TextField 
} from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";
import * as partyAPI from 'api/party.js';

export default function CreatePartyPage() {
    const [partyCode, setPartyCode] = useState('');
    // const [partyUsername, setPartyUsername] = useState('');
    const history = useHistory();

    const createRoom = (e, password) => {
        e.preventDefault();
        setPartyCode('');
        // redirect to generated room
        partyAPI.addParty(password,(err,id)=> {
            if(err) 
                console.log(err);
            console.log(id);
            if(id) {
                history.push('/party?id='+id);
            }

        });   
        
    }

    return (
        <div className='join-party-page'>
            <div className='content-box'>
                <div className='header1'>Create Party</div>
                <div className='inputs-btn-box'>
                <form id='party-form' onSubmit={(e)=>createRoom(e, partyCode)}>
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
                {/* <TextField 
                    className='textfield'
                    size='small'
                    label='Enter your nickname'
                    value={partyUsername}
                    onChange={(e)=>setPartyUsername(e.target.value)}
                    required
                >
                </TextField> */}
                </div>
                <Button type='submit' className='btn'  variant='outlined' size='small'>create</Button>
                </form>
                </div>
            </div>
        </div>
    )
}