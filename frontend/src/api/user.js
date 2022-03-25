import { getConfig } from 'environments';
import axios from 'axios';

const backendUrl = getConfig("backendUrl");
const graphqlUrl = getConfig("graphqlUrl");

export const getUsers = (callback) => {
    const query = `
        query {
            getUsers {
                _id
                username
                email
                profileLink
            }
        }
    `;
    fetch(graphqlUrl, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
    .then((response) => response.json())
    .then((result) => {
        callback(result.errors, result.data.getUsers);
    });
}

export const getUser = (id, callback) => {
    const query = `
        query($id: ID) {
            getUsers(id: $id) {
                _id
                username
                email
                profileLink
            }
        }
    `;
    const variables = {
        id
    }
    fetch(graphqlUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    })
    .then((response) => response.json())
    .then((result) => {
        callback(result.errors, result.data.getUsers);
    });
}

export const addUser = (user, callback) => {
    axios.post(`${backendUrl}/api/signup`, user)
    .then((res) => {
        callback(null, res.data);
    })
    .catch((err) => {
        callback(err.response.data, null)
    })
}

export const signIn = (username, password, callback) => {
    axios.post(`${backendUrl}/api/signin`, {username, password}, {
        credentials: 'include',
        withCredentials: true
    })
    .then((res) => {
        callback(null, res.data);
    })
    .catch((err) => {
        callback(err.response.data, null)
    })
}

export const signOut = (callback) => {
    axios.post(`${backendUrl}/api/signout`, null, {
        credentials: 'include',
        withCredentials: true
    })
    .then((res) => {
        callback(null, res.data);
    })
    .catch((err) => {
        callback(err.response.data, null)
    })
}