export const production = {
  backendUrl: "https://ytwatch.party",
  graphqlUrl: "https://ytwatch.party/api/graphql",
  googleApiKey: "AIzaSyBnQYcaj09zjH_6qY1vHuMBPGcNk0Dw7aw",
  peerhost: "ytwatch.party",
  peerhostport:"443",
  securepeer:true,
}

export const development = {
  backendUrl: "http://localhost:3001",
  graphqlUrl: "http://localhost:3001/api/graphql",
  googleApiKey: "AIzaSyBnQYcaj09zjH_6qY1vHuMBPGcNk0Dw7aw",
  peerhost:"localhost",
  peerhostport:"3001",
  securepeer:false,
}

/**
 * Apply the correct config based on the application environment
 */
export function getConfig(name) {
  return process.env.NODE_ENV === "production"? production[name] : development[name];
}
