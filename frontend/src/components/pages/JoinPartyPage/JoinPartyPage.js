import './JoinPartyPage.scss';
import React, { useEffect, useState } from "react";
import {
    Button,
    TextField
} from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";
import * as PartyAPI from 'api/party';

export default function JoinPartyPage() {
    const [partyId, setPartyId] = useState('');
    const [partyCode, setPartyCode] = useState('');
    const [alreadyHasId, setAlreadyHasId] = useState(false);
    const location = useLocation();
    const history = useHistory();

    const getParty = (id) => {
        // api call

        if (id !== null) {
            setPartyId(id)
            setAlreadyHasId(true)
        }
    }


    const joinRoom = (e, id, code) => {
        e.preventDefault();
        console.log(id, code);
        setPartyCode('');
        // redirect to generated room
        PartyAPI.joinParty(id, code, (err, res)=> {
            if (err) {
                console.log(err);
            } else {
                history.push('party?id=' + res._id);
            }
        });
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
                    <div className='header1'>Joining Party "{partyId}"</div>
                }
                {!alreadyHasId &&
                    <div className='header1'>Join Party</div>
                }
                <div className='inputs-btn-box'>
                <form id='party-form' onSubmit={(e)=>joinRoom(e, partyId, partyCode)}>
                {!alreadyHasId &&
                    <TextField
                        className='textfield'
                        size='small'
                        label='Party ID'
                        value={partyId}
                        onChange={(e)=>setPartyId(e.target.value)}
                        required
                    />
                }
                <TextField
                    className='textfield'
                    size='small'
                    label='Party code'
                    value={partyCode}
                    onChange={(e)=>setPartyCode(e.target.value)}
                    required
                />
                <div><Button type='submit' className='btn'  variant='outlined' size='small'>join</Button></div>
                </form>
                </div>
            </div>
        </div>
    )
}