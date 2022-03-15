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
    const query = `
        mutation($user: CreateUserInput) {
            createUser(user: $user) {
                _id
                username
                email
                profileLink
            }
        }
    `;
    const variables = {
        user
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
        callback(result.errors, result.data.createUser);
    });
}

export const signIn = (username, password, callback) => {
    const query = `
        query($username: String, $password: String) {
            signIn(username: $username, password: $password) {
                _id
                username
                email
            }
        }
    `;
    const variables = {
        username,
        password
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
        callback(result.errors, result.data.signIn);
    });
}