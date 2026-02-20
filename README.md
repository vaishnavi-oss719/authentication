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

- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Login user and get token
- `GET /api/auth/me` → Get user info (Protected)

## Deployment

Deploy the app on [Render](https://render.com/) and push code to GitHub for submission.
