# booking-room

This project is for booking a conference room and is forked from [https://github.com/fullstackreact/food-lookup-demo]

## Project Description
- REST API Server
  - express.js
  - CRUD
  - Seqeulize ORM (sqlite3) 
  - passport (Authentication)
  - jwt (jsonwebtoken)

- React Application (Single Web Application)
  - react.js
  - material-ui
  - bootstrap
  - bootstrap table (support search system)
  - react-cookie

## Requirements
- Nodejs >= 7.10
- npm

## How to run this project

#### Development Env
1. execute 'npm install' in root path(./) and client path(./client/)
2. execute 'npm start' in root path
3. Then API Server and SAP will run right now.

#### Production Env
1. execute 'npm install' in server path(./) and client path(./client/)
2. execute 'npm run build' in client path
3. execute 'set NODE_ENV=production' in server path(./)
4. execute 'node server.js'

