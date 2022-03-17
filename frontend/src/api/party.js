import config from 'environments';

export const addParty = (partyPassword, callback) => {
    const query = `
        mutation($party: CreatePartyInput) {
            createParty(party: $party) {
                _id
            }
        }
    `;
    const variables = {
        partyPassword
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
        callback(result.errors, result.data._id);
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
        callback(result.errors, result.data);
    });
}