# Project title: YoutubeWatchParty
## Demo
https://ytwatch.party

## Team members

- Emile Li Tim Cheong, 1004811251
- Victor Ko, 1005070628 
- JunXing Xu, 1004019028

## A description of the web app

- A site for viewing Youtube videos with friends at the same time.
- Main features of the party (virtual room) will be watching videos, adding videos to a queue and chatting with other users within the room.
- A user can first create a party which is password protected, and then that user becomes the party host.
- The host shares the party link with his friends who will be able to join using the password.
- There is a virtual remote that controls the content of the room.
	- The remote is initially given to the host when the room is first created.
	- The host can 'pass' the remote to any other guest users in the room, but only one at a time.
	- That guest user which received the remote then becomes the host and in turn can also pass the remote to anyone else.
	- However, the original host still has to ability to retrieve the remote whenever he wants.
- So at first, only the host has control over loading and adding videos to the queue.
- Once the host loads a video and presses play, the video starts for everyone in the room and should stay in sync whatever the host does (i.e the progress of video is synced with all users).
- On the guest users' side, they can only adjust their volume but they are denied access to play, pause and seeking features of the video player.
- The virtual rooms last until everyone leaves.
- Chat logs are saved for the entire duration of the room.
- Videos can be deleted from the queue, and can be reordered using the drag and drop feature.
- Have a toggleable dark mode on the entire website.
- Users can upload their own profile pictures.

## Key features that will be completed by the Beta version

- Creating and joining a party (virtual room).
- Loading and adding videos to a queue.
- Instant messaging.
- Synchronization of the video player between the host and all the other users.
- Authentication of users both when first entering the website and for joining a party.
- Virtual remote which is only in the hands of the host at any point in time.

## Additional features that will be complete by the Final version

- Toggleable dark mode on the entire website.
- Users are able to upload their own profile pictures.

## Technology stack that you will use to build and deploy it

- React
- MongoDB
- Docker for database and deployment
- Express + GraphQL

## Top 5 technical challenges

- Synchronization of videos.
- Synchronization of the playlist queue especially when being reordered by the host.
- Using socket.io for instant messaging.
- Using graphql, since most of us don't have prior experience.
- Deploying with docker.
