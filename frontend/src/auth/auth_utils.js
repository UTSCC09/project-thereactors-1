
export function signedIn() {
    return localStorage.getItem('signed-in') && localStorage.getItem('signed-in')!='' ;
}
export function signIn(username) {
    localStorage.setItem('signed-in','true');
    localStorage.setItem('username',username);
}
export function signOut() {
    localStorage.setItem('signed-in','');
    localStorage.setItem('username','');
}
export function getUser() {
    return localStorage.getItem('username');
}