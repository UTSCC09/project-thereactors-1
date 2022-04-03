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
    const [theme, setTheme] = useState('');

    const getParty = (id) => {
        // api call

        if (id !== null) {
            setPartyId(id)
            setAlreadyHasId(true)
        }
    }

    let errTimeout;
    const joinRoom = (e, id, code) => {
        e.preventDefault();
        // redirect to generated room
        PartyAPI.joinParty(id, code, (err, res) => {
            if (err) {
                document.getElementById('join-err-msg').style.visibility = 'visible';
                document.getElementById('join-err-msg').innerHTML = 'Invalid ID or password!';
                clearTimeout(errTimeout);
                errTimeout = setTimeout(() => {
                    document.getElementById('join-err-msg').style.visibility = 'hidden';
                    document.getElementById('join-err-msg').innerHTML = '';
                }, 4000);
            } else {
                history.push('party?id=' + res._id);
            }
        });
    }

    useEffect(() => {
        const search = location.search;
        const partyId = new URLSearchParams(search).get('id');
        getParty(partyId);

        if (localStorage.getItem('theme')) {
            setTheme(localStorage.getItem('theme'));
        }
        document.addEventListener('themeChange', () => {
            setTheme(localStorage.getItem('theme'));
        });
    }, []);

    return (
        <div className='join-party-page'>
            <div className={theme === 'dark' ? 'content-box box-common-dark' : 'content-box'}>
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
                        className={theme === 'dark' ? 'textfield textfield-dark' : 'textfield'}
                        size='small'
                        label='Party ID'
                        value={partyId}
                        onChange={(e)=>setPartyId(e.target.value)}
                        required
                    />
                }
                <TextField
                    className={theme === 'dark' ? 'textfield textfield-dark' : 'textfield'}
                    size='small'
                    label='Party password'
                    value={partyCode}
                    onChange={(e)=>setPartyCode(e.target.value)}
                    required
                />
                <div id='join-err-msg' style={{color:'red',visibility:'hidden',marginTop:'10px'}}></div>
                <div><Button type='submit' className='btn'  variant='outlined' size='small'>join</Button></div>
                </form>
                </div>
            </div>
        </div>
    )
}