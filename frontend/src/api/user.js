import config from 'environments';
import axios from 'axios';

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
    fetch(config.graphqlUrl, {
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
    fetch(config.graphqlUrl, {
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
    axios.post(`${config.backendUrl}/api/signup`, user)
    .then((res) => {
        callback(null, res.data);
    })
    .catch((err) => {
        callback(err.response.data, null)
    })
}

export const signIn = (username, password, callback) => {
    axios.post(`${config.backendUrl}/api/signin`, {username, password}, {
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
    axios.post(`${config.backendUrl}/api/signout`, null, {
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