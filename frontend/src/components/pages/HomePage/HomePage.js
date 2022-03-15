import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import config from '../../../environments'

export default function HomePage() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(config.backendUrl);
        setSocket(newSocket);
        console.log(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    return (
        <div>Home Page</div>
    )
}