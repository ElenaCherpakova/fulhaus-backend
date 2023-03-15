#Acronym REST API

A simple REST API for acronyms(a basic CRUD Operation).

## Installation

1. Clone the repository 
2. Go to the backend directory `cd backend`
3. Run `npm install` to install the dependencies
4. Run `npm start` to start the server
5. Go to `http://localhost:3000/acronyms` to see the app running

## Usage
- `GET http://localhost:3000/acronyms` - get all acronyms 
- `GET http://localhost:3000/acronyms?page=1&limit=10&search=:search` - get acronyms with pagination and search
- `POST http://localhost:3000/acronyms/new` - add an acronym
- `PATCH http://localhost:3000/acronyms/:acronymID` - update an existing acronym
- `DELETE http://localhost:3000/acronyms/:acronymID` - delete an acronym from database

## Seed Data 

There are already some seed data present in the database. To seed the database with data, you can run the following command:
```
node seeds.js
```

## Technologies Used
- NodeJS
- ExpressJS
- MongoDB
- Mongoose
- EJS-Mate
- Nodemon



