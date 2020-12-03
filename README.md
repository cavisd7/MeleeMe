# melee.me
A website for finding people to play Super Smash Bros. Melee with on Slippi.
Check out the live version of the site [here](https://meleeme.net) (Temporarily shutdown)

# About
melee.me is a full stack app made with Nodejs and a React frontend. 
It includes the ability to create accounts / profiles, a live updating list of current match requests and an real-time chat.

# Features


# How to build?
## To build backend server:
```shell
git clone https://github.com/cavisd7/MeleeMe
cd MeleeMe/backend/
npm install
```

## Run with Docker-Compose
In MeleeMe/backend/ run:
```shell
npm run dev:docker:start
```

## Run locally (without Docker)
### Setup environment
You will need a version >= 12.2 of postgresql and >= 6.0.9 of redis running on your machine. If you do not have redis or postgres see above to run with Docker-Compose.
A .env.local file is needed to run the server. This is where you will provide redis and postgresql connection information as well as other server configuration. 

In MeleeMe/backend/ run:
```shell
npm run dev:local
```

## To build frontend:
```shell
cd ../frontend/
npm install
```

Start webpack dev server:
```shell
npm run dev:start
```