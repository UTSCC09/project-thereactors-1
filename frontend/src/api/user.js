import config from 'environments';

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
    fetch(`${config.backendUrl}/api/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then((response) => response.json())
    .then((result) => {
        callback(result.errors, result);
    });
}

export const signIn = (username, password, callback) => {
    fetch(`${config.backendUrl}/api/signin`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((result) => {
        callback(result.errors, result);
    });
}
