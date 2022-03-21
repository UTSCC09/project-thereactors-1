
import io from 'socket.io-client';
import config from 'environments';


const socket = io(config.backendUrl,{withCredentials: true,});

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