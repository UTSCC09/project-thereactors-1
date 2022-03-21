FROM node:16.14.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g npm@8.5.5

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# COPY package.json /srv/app/ytparty-client
# COPY package-lock.json /srv/app/ytparty-client

# COPY public /srv/app/ytparty-client/public
# COPY src /srv/app/ytparty-client/src

# COPY . /srv/app/ytparty-client
COPY public /usr/src/app/public
COPY src /usr/src/app/src
COPY package.json /usr/src/app/package.json
# RUN npm install

RUN npm install



CMD ["npm","start"]