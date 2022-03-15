import './HomePage.scss';
import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import config from 'environments';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useHistory } from 'react-router-dom';
import * as UserAPI from 'api/user';

export default function HomePage() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Socket test
        const newSocket = io(config.backendUrl);
        newSocket.on("connect", () => {
            setConnected(true);
        })
        setSocket(newSocket);

        // GraphQL test
        const user = {
            username: "user1",
            email: "user1@mail.com",
            password: "123",
            profileLink: ""
        }
        let id = "";
        UserAPI.addUser(user, (err, res) => {
            if (err) console.log(err[0])
            else {
                console.log('addUser', res);
                id = res[0]._id;
            }
        })

        UserAPI.getUser(id, (err, res) => {
            if (err) console.log(err[0])
            console.log('getUser', res);
        })

        UserAPI.getUsers((err, res) => {
            if (err) console.log(err[0])
            console.log('getUsers', res);
        })

        UserAPI.signIn(user.username, user.password, (err, res) => {
            if (err) console.log(err[0])
            console.log('signIn', res);
        })

        return ()=>newSocket.close();
    }, [setSocket, setConnected]);

    const history = useHistory();

    const redirectTo = (page) => {
        history.push(page);
    }

    return (
        <div className="home-page">
            <div className="cover-img-section"></div>
            <div className="main-section">
                <Stack spacing={2} direction="column">
                    <Button variant='outlined' onClick={()=>redirectTo('join')}>Join a live party</Button>
                    <Button variant='outlined' onClick={()=>redirectTo('party')}>Start a new party</Button>
                    <Button variant='outlined' onClick={()=>redirectTo('schedule')}>Schedule for later</Button>
                </Stack>
                {connected && <>socket connected</>}
            </div>
        </div>
    )
}