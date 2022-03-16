import config from 'environments';

export const addParty = (party, callback) => {
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
        callback(result.errors, result.data._id);
    });
}
