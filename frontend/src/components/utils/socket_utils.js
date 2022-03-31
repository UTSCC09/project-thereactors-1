
import io from 'socket.io-client';
import { getConfig } from 'environments';

const socket = io(getConfig("backendUrl"), { withCredentials: true }).connect();

export function disconnectSocket() {
    socket.disconnect();
    socket.connect();
    socket.removeAllListeners();
    socket.onAny((event)=>(console.log(event)))
}

export function getSocket() {
    //if(!socket.connected){
    //    socket.connect();
    //}
    return socket;
}
