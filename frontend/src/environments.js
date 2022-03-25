export const production = {
  backendUrl: "https://yt-watchparty.herokuapp.com",
  graphqlUrl: "https://yt-watchparty.herokuapp.com/api/graphql",
  googleApiKey: "AIzaSyBnQYcaj09zjH_6qY1vHuMBPGcNk0Dw7aw"
}

export const development = {
  backendUrl: "http://localhost:3001",
  graphqlUrl: "http://localhost:3001/api/graphql",
  googleApiKey: "AIzaSyBnQYcaj09zjH_6qY1vHuMBPGcNk0Dw7aw"
}

/**
 * Apply the correct config based on the application environment
 */
export function getConfig(name) {
  return process.env.NODE_ENV === "production"? production[name] : development[name];
}
