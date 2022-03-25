# Deployment
We are using the DigitalOcean Droplet VM to manage deployment. We build our application as an image and pull the latest image in the VM. We are using Nginx for load balancing and Certbot to certify our application to use HTTPS.

# Technology Stacks
- DigitalOcean VM
- Docker
- GHCR (GitHub Container Registry)
- GitHub Workflow (Automatically build and push the image to GHCR)
- Nginx (Load balancing)
- Certbot (HTTPS)

# Steps
1. Login to the server VM
```
$ ssh root@143.198.41.83
# Enter the password
```
2. Login to the docker **(I already did that once so you don't need to do it again)**
```
$ export CR_PAT=GITHUB_PAT
$ echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
```
3. Change to the correct directory
```
$ cd ytwatchparty
```
4. Pull the latest version of the application image using Docker
```
$ docker-compose pull
```
5. Restart the application
```
$ docker-compose up -d
```

# Nginx Config
```
server {

        server_name ytwatch.party www.ytwatch.party;

        location / {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/ytwatch.party/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/ytwatch.party/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    if ($host = ytwatch.party) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name ytwatch.party www.ytwatch.party;
    return 404; # managed by Certbot
```

# Production docker-compose
```yml
version: "3.5"
services:
  mongo:
    image: mongo:4.2.7-bionic
    container_name: ytwatchparty-mongo
    ports:
      - 27020:27017
    volumes:
      - ytwatchparty-mongo-volume:/data/db/
      - ./mongo/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ytwatchparty
      MONGO_INITDB_DATABASE: admin

  app:
    image: ghcr.io/utscc09/ytwatchparty:latest
    container_name: ytwatchparty-app
    ports: 3001:3001
    depends_on:
      - mongo

volumes:
  ytwatchparty-mongo-volume:
```
