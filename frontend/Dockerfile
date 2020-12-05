FROM node:latest

WORKDIR /app

COPY package.json /app
#Should layer?
COPY tsconfig.json /app 

RUN npm install

COPY . /app

ENV API_ROOT_PROD=https://api.meleeme.net/api/v1
ENV API_ROOT_DEV_LOCAL=http://localhost:4000/api/v1
ENV API_ROOT_DEV_DOCK=meleeme-backend/api/v1
ENV WS_ROOT_PROD=wss://api.meleeme.net
ENV WS_ROOT_DEV_LOCAL=ws://localhost:4000
ENV WS_ROOT_DEV_DOCK=ws://meleeme-backend
ENV IS_DOCKER=true

EXPOSE 3000

CMD ["npm", "run", "dev:start"]