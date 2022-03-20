# Setting up Recipe Central

## Docker
We use docker for database and deployment. Make sure you have docker running in order to gain access to the MongoDB. In the root folder, run:
```
$ docker compose up -d
```

## Backend
1. Move to the backend folder
```
$ cd backend
```
2. Install necessary packages
```
$ npm install
```
3. Start the server
```
$ npm start
```

#### Notes
1. Use `npm start` to run the server instead of `node index.js` because we use `nodemon` so that the server will be reloaded automatically after we edited the files.
2. You can play around the GraphQL UI to understand it by navigating to [http://localhost:3001/api/graphql](http://localhost:3001/api/graphql), make sure your server is running before going to the URL.
3. All configurations should be stored in `config.json`, in this way we can handle all configurations in one place.

## Frontend
1. Move to the frontend folder
```
$ cd frontend
```
2. Install necessary packages
```
$ npm install
```
3. Start the server
```
$ npm start
```
  "mongodbUrl":"mongodb+srv://admin:TDIu5HUR126xwjIV@cluster0.xkzw0.mongodb.net/recipeCentral?retryWrites=true&w=majority&authSource=admin",
