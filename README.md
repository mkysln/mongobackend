# mongobackend

A small Node.js REST API built with Express and Mongoose. It connects to MongoDB and exposes endpoints for users, movies, and movie comments.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/users` | List users |
| POST | `/users` | Create a user from a JSON request body |
| GET | `/movies` | List up to 20 movies |
| GET | `/movies/:id` | Find a movie by its MongoDB ID |
| GET | `/comments/:movieId` | List comments associated with a movie |

The user model includes `name` and `email`. Movie and comment documents use the existing MongoDB collections.

## Requirements

- Node.js
- A MongoDB connection string

## Setup

Install dependencies:

```sh
npm install
```

Set the connection string in your environment, then start the server:

```sh
export MONGO_URI="your_mongodb_connection_string"
npm start
```

The server listens on port `3000` by default. Set `PORT` to use another port. Avoid committing database credentials.