FROM node:latest

WORKDIR /app

COPY package.json /app
#Should layer?
COPY tsconfig.json /app 

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "run", "dev:start"]