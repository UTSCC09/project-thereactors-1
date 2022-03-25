export const development = {
  "port": 3001,
  "mongodbUrl":"mongodb+srv://admin:TDIu5HUR126xwjIV@cluster0.xkzw0.mongodb.net/recipeCentral?retryWrites=true&w=majority&authSource=admin",
  "jwtSecret": "bWNYDRHFFHrndh4qK7dgS7ky5DpX3EeC",
  "passwordSaltRounds": 10,
  "cookieMaxAge": 604800000,
  "API_KEY":"AIzaSyDFF4pfMtCwFrz_jGe2z73OWSH6ZK9KIVI",
  "frontendUrl":"http://localhost:3000"
}

export const production = {
  "port": 3001,
  "mongodbUrl":"mongodb+srv://admin:TDIu5HUR126xwjIV@cluster0.xkzw0.mongodb.net/recipeCentral?retryWrites=true&w=majority&authSource=admin",
  "jwtSecret": "bWNYDRHFFHrndh4qK7dgS7ky5DpX3EeC",
  "passwordSaltRounds": 10,
  "cookieMaxAge": 604800000,
  "API_KEY":"AIzaSyDFF4pfMtCwFrz_jGe2z73OWSH6ZK9KIVI",
  "frontendUrl":"https://yt-watchparty.herokuapp.com/"
}

/**
 * Apply the correct config based on the application environment
 */
export function getConfig(name) {
  return process.env.NODE_ENV === "production"? production[name] : development[name];
}
