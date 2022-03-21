FROM node:16.14.0-alpine

RUN mkdir -p /srv/app/ytparty-server
WORKDIR /srv/app/ytparty-server

# ENV PATH /srv/app/ytparty-server/node_modules/.bin:$PATH

# COPY package.json /srv/app/ytparty-server
# COPY package-lock.json /srv/app/ytparty-server


# COPY . /srv/app/ytparty-server

COPY package.json /srv/app/ytparty-server/package.json
RUN npm install --legacy-peer-deps

COPY . /srv/app/ytparty-server

EXPOSE 3001
# RUN npm uninstall bcrypt
# RUN npm install bcrypt


CMD ["npm","start"]