# User Authentication & Authorization API

This project demonstrates user authentication and authorization using **JWT** in a **Node.js + Express + MongoDB** application following the MVC pattern.

## Features

- User registration with password hashing
- User login with JWT token generation
- Protected route to get user information
- Follows MVC architecture
- API documented in Postman

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- Postman

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Setup `.env` file with your Mongo URI and JWT secret
4. Run server: `npm run dev`
5. Test APIs using Postman

## API Endpoints

- `POST /api/user/register` → Register new user
- `POST /api/user/login` → Login user and get token
- `GET /api/user/getuser` → Get user info (Protected)
     |
- (Authorization -> inheirt auth from params)
- (Header ->keyvalue ->Authorization -> value->token
- output
- {
    "message": "Authorized User",
    "data": [
        {
       "_id": "69981dd42e753ff3ec5d34d0",
            "username": "kumar",
            "email": "kumar@gmail.com",
            "password": "$2b$10$VImgtZaxbTl6vXWyD4qIHOoXeNaIL9iGwCktvMQzeAT0QOilrWOYy",
            "role": "admin",
            "__v": 0
        }
    ]
}

## Deployment

Deploy the app on [Render](https://render.com/) and push code to GitHub for submission.
