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

export const getUserByUsername = (username) => {
    const query = `
        query($username: String) {
            getUsers(username: $username) {
                _id
                username
                email
            }
        }
    `;
    const variables = { username };
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

export const addUser = (user, avatar, callback) => {
    // Copy the fields into form data
    const formData = new FormData();
    for (let name in user) {
        formData.append(name, user[name])
    }
    // Add avatar
    if (avatar) {
        formData.append('avatar', avatar, avatar.name);
    }
    axios.post(`${backendUrl}/api/signup`, formData)
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

export const getAvatar = (username, callback) => {
    axios.get(`${backendUrl}/api/${username}/avatar`, { responseType:"blob" })
        .then((res) => {
            if (res.status === 404) {
                callback("https://180dc.org/wp-content/uploads/2016/08/default-profile.png");
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(res.data);
                reader.onloadend = () => {
                    callback(reader.result);
                };
            }
        });
}

export const updateUser = (username, user, callback) => {
    const query = `
        mutation($username: String, $user: UserUpdateInput) {
            updateUser(username: $username, user: $user) {
                _id
                firstName
                lastName
                email
            }
        }
    `;
    const variables = { username, user };
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
        callback(result.errors, result.data.updateUser);
    });
}