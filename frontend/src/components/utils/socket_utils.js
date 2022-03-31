
import io from 'socket.io-client';
import { getConfig } from 'environments';

const socket = io(getConfig("backendUrl"), { withCredentials: true });

export function disconnectSocket() {
    socket.disconnect();
    // socket.connect();
}

export function getSocket() {
    if(!socket.connected){
        socket.connect();
    }
    return socket;
}