
import io from 'socket.io-client';
import { getConfig } from 'environments';

const socket = io(getConfig("backendUrl"), { withCredentials: true });

export function connectToSocket() {
    if(!socket.connected){
        socket.connect();
    }
}
export function reconnectToSocket() {
    console.log("reconnect")
    socket.disconnect();
    socket.connect();
}

export function getSocket() {
    return socket;
}