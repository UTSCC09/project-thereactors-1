import './JoinPartyPage.scss';
import React, { useEffect } from "react";
import { 
    Button,
    TextField 
} from "@mui/material";
import { useLocation } from "react-router-dom";

export default function JoinPartyPage() {
    
    useEffect(() => {

    }, []);

    const search = useLocation().search;
    const partyName = new URLSearchParams(search).get('name');

    return (
        <div className='join-party-page'>
            <div className='content-box'>
                <div className='header1'>Joining party "{partyName}"</div>
                <div className='inputs-btn-box'>
                <div className='inputs-box'>
                <TextField 
                    className='textfield'
                    size='small'
                    label='Party username'
                    onChange={()=>{}}
                >
                </TextField>
                </div>
                <Button className='btn'  variant='outlined' size='small'>join</Button>
                </div>
            </div>
        </div>
    )
}