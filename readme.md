# Project title: YoutubeWatchParty

## Team members

- Emile Li Tim Cheong, 1004811251
- Victor Ko, 1005070628 
- JunXing Xu, 1004019028

a
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
- All users can interact through the chat box by sending messages, or react through emojis which will be displayed on top of the video.
- All users can join a voice call
- Users can leave or rejoin the party or call whenever they feel


## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. 

## Deployment

**Task:** Explain how you have deployed your application. 

## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Using WEBRTC / PEER-WEBRTC in a way that synchronizes data between users, such as implmenting voice calls or synchronizing videos.
2. 
3. Deploying the docker containers from github container registry onto Digital Ocean, and setting up the production configurations for it such as ssl.

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number). 

Victor Ko: Added features such as voice call, messaging, and video synchronization

# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 

Darkmode is implemented for this site for easy viewing.