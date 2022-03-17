import config from 'environments';
import * as authAPI from 'auth/auth_utils.js';

export const addParty = (password, callback) => {
    let party = {password, hostedBy: authAPI.getToken()};
    const query = `
        mutation($party: CreatePartyInput) {
            createParty(party: $party) {
                _id
            }
        }
    `;
    const variables = {
        party
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
        callback(result.errors, result.data.createParty._id);
    });
}

export const joinParty = (id, password, callback) => {
    const query = `
        query($id: String, $password: String) {
            joinParty(_id: $id, password: $password) {
                _id
            }
        }
    `;
    const variables = {
        id,
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
        callback(result.errors, result.data.joinParty);
    });
}
