FROM node:latest

WORKDIR /app

COPY package.json /app
#Should layer?
COPY tsconfig.json /app 

RUN npm install

COPY . /app

EXPOSE 4000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]