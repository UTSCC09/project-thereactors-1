import config, { getConfig } from 'environments';
import * as authAPI from 'auth/auth_utils.js';

const graphqlUrl = getConfig("graphqlUrl");

export const addParty = (password, callback) => {
    let party = {password};
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
    fetch(graphqlUrl, {
        method: "POST",
        credentials: 'include',
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
    fetch(graphqlUrl, {
        method: "POST",
        credentials: "include",
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
