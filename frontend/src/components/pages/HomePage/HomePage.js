import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import config from '../../../environments'

export default function HomePage() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(config.backendUrl);
        newSocket.on("connect", () => {
            setConnected(true);
        })
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket, setConnected]);

    return (
        <div>
            Home Page
            {connected && <div>Socket connection success</div>}
        </div>
    )
}