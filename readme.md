# Project title: YoutubeWatchParty

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
- The frontend is built with React

### The backend
- mongoose which is an interface using the mongodb drivers
    - schemas are built on mongodb objects
    - querying users, room information, messages are done through mongodb.
- graphql
- RESTAPI
- express server
    - socket io is also listening on top of this express server

    - peerjs server which is listening to /peerjs path
        - peerjs is a peer to peer webrtc api to coordinate the sending of audio streams to peers
        - This server allows users to


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

1. Using WEBRTC / PEER-WEBRTC in a way that synchronizes data between users, such as implmenting voice calls or synchronizing videos.
2.
3. Deploying the docker containers from github container registry onto Digital Ocean, and setting up the production configurations for it such as ssl.

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).

Victor Ko: Added functionality for features such as voice call, messaging, and video synchronization

JunXing Xu: Setup the framework for the application and implemented APIs needed for the frontend. Setup deployment and GitHub action for CI/CD. Server maintenance and monitoring the data on DigitalOcean.

# One more thing?

**Task:** Any additional comment you want to share with the course staff?

Darkmode is implemented for this site for easy viewing.
