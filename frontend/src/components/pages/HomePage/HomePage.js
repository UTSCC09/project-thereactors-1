import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import config from '../../../environments'

export default function HomePage() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [graphqlSuccess, setGraphqlSuccess] = useState(false);

    useEffect(() => {
        // Socket test
        const newSocket = io(config.backendUrl);
        newSocket.on("connect", () => {
            setConnected(true);
        })
        setSocket(newSocket);

        // GraphQL test
        const query = `
            query {
                getUsers {
                    _id,
                    firstName,
                    lastName
                }
            }
        `;
        fetch(config.graphqlUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query }),
        })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            setGraphqlSuccess(true);
        });

        return () => newSocket.close();
    }, [setSocket, setConnected, setGraphqlSuccess]);

    return (
        <div>
            Home Page
            {connected && <div>Socket connection success</div>}
            { graphqlSuccess && <div>GraphQL query success</div> }
        </div>
    )
}