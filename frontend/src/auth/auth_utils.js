import {reconnectToSocket} from 'components/utils/socket_utils'; 

export function signedIn() {
    return localStorage.getItem('signed-in') && localStorage.getItem('signed-in')!='' ;
}
export function signIn(username) {
    localStorage.setItem('signed-in','true');
    localStorage.setItem('username',username);
    reconnectToSocket();
    console.log("reconnect to socket")
}
export function signOut() {
    localStorage.setItem('signed-in','');
    localStorage.setItem('username','');
    reconnectToSocket();
}
export function getUser() {
    return localStorage.getItem('username');
}