import {disconnectSocket} from 'components/utils/socket_utils'; 
import * as UserAPI from 'api/user';
export function signedIn() {
    return localStorage.getItem('signed-in') && localStorage.getItem('signed-in')!='' ;
}
export function signIn(username) {
    localStorage.setItem('signed-in','true');
    localStorage.setItem('username',username);
    disconnectSocket();
}
export function signOut() {
    localStorage.setItem('signed-in','');
    localStorage.setItem('username','');
    UserAPI.signOut(()=> {
        disconnectSocket();
    });
}
export function getUser() {
    return localStorage.getItem('username');
}