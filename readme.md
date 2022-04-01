# Project title: YoutubeWatchParty

## Demo
https://ytwatch.party

## Team members

- Emile Li Tim Cheong, 1004811251
- Victor Ko, 1005070628
- JunXing Xu, 1004019028


## Project URL

- https://ytwatch.party/

## Project Video URL

**Task:** Provide the link to your youtube video. Please make sure the link works.

## Project Description

- A site for viewing the same Youtube videos at the same time with friends.
- Main features of the party (virtual room):
    - Watching the same video synchronously
    - Chatting with other users within the room through voice or text
    - Sending emotes and displaying them on top of the video

The general user flow is as follows
- A user signs up on the site
- The user then can update their profile picture, etc
- The user can create a room and add a password
    - Other users can join this room with provided the link and password
- The host user can add youtube videos to a playlist and set the current video and video list to be played.
    - This video queue can be modified as needed
    - The host can pass the control to other users
    - The original creator can retrieve their remote
- The current video playing is synchronized with the progress of the host
    - The host can pause,play,skip ahead, and other users will be brought to that timestamp at the same time
    - Other users will not be able to modify the current progress.
- All users can interact through the chat box by sending messages, or react by sending emojis on the video itself
- All users can join a voice call
    - There is an option to mute their microphone or leave call and then rejoin.
- Users can leave or rejoin the room or call whenever they feel
- The room will be deleted once all users leave


## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used.

The app is made up of three components

### The frontend

The frontend is built with the React framework, using javascript, some html and scss (which is similar to css but is easier to nest classes
-  It uses axios to fetch user data asynchronously
-  It uses socketio for server communication with the client
    - It handles chat synchronization, video synchronization, voice call joining synchronization, emote synchronization, and playlist updates
-  Peerjs is used in the frontend for peer to peer webrtc connections in order to start the call between peers

In terms of the technical overview of the frontend the app is built in the following way.

- Pages are routed through a browser with various paths
- Certain pages will redirect to the sign in page through another component that checks if the user is currently signed in. Sources were used to figure out how to implement the privateroute to redirect to the sign in page from the following article https://medium.com/@thanhbinh.tran93/private-route-public-route-and-restricted-route-with-react-router-d50b27c15f5e. 
- A navbar is included onto every page with logic to display the current user or a sign in button otherwise

- For the main page, sign in, sign up,room creation, room join, and edit profile pages. They are rendered mostly statically with form fields and buttons to submit async rest requests to the server for updating user information or creating new rooms. Redirection logic is also included with the button clicks.

- For authentication, a jwt token is included in cookie with samesite,secure, and httponly flags included. This cookie is also sent to the socket on connection, to ensure that the socket client has an authenticated user. When user logs out, the token is removed. 

For the dynamic aspects of the application, it is in the '/party' page. 
- The overall logic is to use socketio to receive and emit events which will render components when needed.
- When a user joins, the socket would be initialized, and send a connection request to the server along with a join-room event
    - The server will send the appropriate information through the socket such as chat logs, video information, users and other room information to be rendered
    - The client will also continue to listen for any updates to the video progress, chat, video playlist, user joining updates through the socket and handle them accordingly
- The party page will have several components such as chat, sidepanel, connected users, video playlist, and emotes.
    - The chat includes an input that will emit a socket event to send the message to the server
        - When the user receives the message from the server, it will update the messages
- The video uses React-Player api which provides an interface for playing youtube videos inside an iframe and allowing controls and video progress updates
    - These updates will be emitted to the server where it can tell clients to play, pause, or update their progress
- The user can click on emotes to display a specific emote on the video. This is through signaling the server to send an emote similar to messaging
- For voice calls, socketio is used to signal the client to establish a peer to peer connection with other clients
    - First the client gets an peer id from the server
    - Then the client tells the server its id, which the server can then map the user to the id, since the user has been authenticated through the socket
    - When another user attempts to join call, the server will send everyone in that call an event that tells the other users to call that joiner with its peer id
    - that way multiway calls can be established
    - mediaStreams are acquired through the browser interface, and similarly with muting the stream.



### The backend

The backend is written in javascript.

The following frameworks/apis are used

- mongoose which is an interface for querying mongodb using the mongodb drivers
    - Schemas are built on mongodb objects
    - Querying users, room information, and messages are done through mongodb.
- graphql
    - These endpoints were used to handle requests for user information, and room information from the database
- RESTAPI
    - This was used to send cookie information and user information when the user signs in/up and for updating user profiles 
- express server
    - The express server had middleware handling many other parts of the server.
    - Socket io is listening on top of this express server
        - It handles all the coordinations of videos, voice calls, chat, and other information in order to send to all users in the room for updates
    - peerjs express server is listening to /peerjs path
        - peerjs is a peer to peer webrtc api to coordinate the sending of audio streams to peers
        - This server allows users to send the correct information to perform peer web rtc connections
        - The server is a library from peer

Otherwise, handling was done through utility functions such as checking if user was authenticated, and then executing certain procedures. 

bcryptjs was used to salt and hash the passwords stored in the database. 
json web tokens were used to authenticate users 
validator and mongo-sanitize were used to ensure client data were correct and valid.


### The database
- This is a mongodb instance running from a docker container


## Deployment

We are using the DigitalOcean Droplet VM for deployment. We build our application as a Docker image and push it to GHCR (GitHub Container Registry). We then pull the latest image in the VM and run it as a container using Docker. The whole deployment process can be described with the following steps:
1. The `release` workflow is a GitHub action that automatically builds a Docker image whenever we pushed to the `main` branch or merge a pull request into the `main` branch.
2. After the image is built, we login to the VM by SSH and pull the latest image using `docker compose pull`.
3. And lastly, we use `docker compose up -d` to restart the containers.

### Load Balancing

We use Nginx as a reverse proxy for load balancing. Another reason why we choose Nginx is it integrates well with Certbot and we do not need extra configurations for setting up HTTPS.
### HTTPS

We use Certbot (Let's Encrypt) to certify our application.

### Technologies Used
- DigitalOcean Droplet VM
- Docker
- GHCR (GitHub Container Registry)
- GitHub Action
- Nginx
- Certbot

## Maintenance

We use the graphs provided by DigitalOcean to monitor our server. We monitor data such as the CPU %, memory usage, and bandwidth. The following are some data that we found interesting and we investigated the reasons behind.
- The CPU usage is steady most of the time, around 10% to 20%. However, sometimes it spiked to 80%. After investigation, our assumption is those spikes were caused by the Docker service. The CPU usage spiked when we pulled the latest image and restart the containers.
- The memory usage is high all the time, around 50% to 65%. It is because we choose the 1GB memory Droplet and the Docker service consumes a lot of memory since the containers are VMs.

![CPU %](/assets/cpu.png)
![CPU %](/assets/load.png)
![CPU %](/assets/memory.png)
![CPU %](/assets/bandwidth.png)

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items.

1. Using PEER-WEBRTC to connect users in a call and provide calling functionality both ways, for n users.
2. Using socketio (webrtc) to synchronize events happening in the room, such as video progress, user joins, disconnects, sending emotes, updating video playlists, providing authentication. 
3. Setting up github container registry to pull and build from main, then deploy onto Digital Ocean, and setting up the production configurations for it

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).

Victor Ko: Added functionality for features such as voice call, messaging, and video synchronization

JunXing Xu: Setup the framework for the application and implemented APIs needed for the frontend. Setup deployment and GitHub action for CI/CD. Server maintenance and monitoring the data on DigitalOcean.

# One more thing?

**Task:** Any additional comment you want to share with the course staff?

Darkmode is implemented for this site for easy viewing.
