# Blog API – NestJS & Prisma

A RESTful API built with **NestJS** and **Prisma**, offering user authentication, role-based access, and full CRUD support for blogs and comments. It integrates with either **Neon** or a local **PostgreSQL Docker** setup, and includes robust end-to-end testing using **Jest** and **Pactum**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Options (Neon or Docker)](#database-options-neon-or-docker)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Scripts](#scripts)
- [License](#license)

---

## Features

- **RESTful API** built with **NestJS**
- **JWT-based authentication** (access tokens only)
- **Role-based authorization**
- **Secure password hashing** with bcrypt
- **Helmet** for setting secure HTTP headers
- **Rate limiting** to mitigate brute-force and abuse
- **CRUD operations** for:

  - Users
  - Posts
  - Comments

- **DTO-based request validation** using class-validator
- **Modular architecture** following SOLID principles
- **Global exception handling** and input validation
- **Environment-based configuration** via `.env` files
- **PostgreSQL** database integration with **Prisma ORM**
- **Optional Docker Compose** setup for local PostgreSQL
- **E2E testing** using **Jest** and **Pactum**

---

## Tech Stack

- **Backend**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL (via [Neon](https://neon.tech) or Docker)
- **Testing**: Jest, Pactum
- **Runtime**: Node.js

---

## Getting Started

### 1. Clone the Repository

```bash
git https://github.com/kxng0109/nest-blog-platform-api.git
cd nest-blog-platform-api
```

### 2. Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?schema=public
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_DB=<db>
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN="15m"
```

For testing, a separate `.env.test` is used:

```env
DATABASE_URL=postgresql://<test_user>:<test_password>@<host>/<test_db>?schema=public
```

---

## Database Options (Neon or Docker)

You can choose between:

### Option 1: **Neon** (Recommended)

No local setup required. Just provide the Neon database URL in `.env`.

### Option 2: **Docker (Optional for Local Setup)**

If you prefer using a local PostgreSQL instance with Docker:

#### Start the container

```bash
npm run db:start
```

#### Stop the container

```bash
npm run db:stop
```

#### Reset the container (delete volumes)

```bash
npm run db:reset
```

#### Restart the container

```bash
npm run db:restart
```

Then run migrations:

```bash
npx prisma migrate dev
```

---

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

---

## API Overview

### Auth

- `POST /auth/signup` – Register a new user
- `POST /auth/signin` – Log in and receive JWT token

### Users

- `GET /users/me` – Get current user’s profile
- `GET /users/me/posts` – Get posts created by the current user
- `GET /users/:authorId/posts` – Get posts created by a specific user

### Posts

- `POST /posts` – Create a new post
- `GET /posts` – Get all posts
- `GET /posts/:id` – Get a specific post
- `PATCH /posts/:id` – Update a post (author or admin)
- `DELETE /posts` – Delete all posts from the current user (author or admin)
- `DELETE /posts/:id` – Delete a specific post (author or admin)
- `POST /posts/:id/comments` – Add a comment to a post
- `GET /posts/:id/comments` – Get all comments on a post

### Comments

- `PATCH /comments/:id` – Edit a comment (owner or admin)
- `DELETE /comments/:id` – Delete a comment (owner or admin)

> Note: Most endpoints require JWT authentication. Access is controlled based on user roles.

---

## Testing

End-to-end tests are implemented using **Jest** and **Pactum**.

To run E2E tests:

```bash
npm run test:e2e
```

- Automatically loads `.env.test`
- Resets the test database
- Runs the full suite

You do **not** need to manually run `pretest:e2e`; it is executed automatically before `test:e2e`.

---

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

---

## Scripts

| Script       | Description                          |
| ------------ | ------------------------------------ |
| `start`      | Run the app normally                 |
| `start:dev`  | Run with auto-reload                 |
| `start:prod` | Run the production build             |
| `build`      | Compile TypeScript                   |
| `lint`       | Run ESLint on all files              |
| `format`     | Format files with Prettier           |
| `test:e2e`   | Run E2E tests (includes DB reset)    |
| `db:start`   | Start PostgreSQL via Docker          |
| `db:stop`    | Stop the PostgreSQL Docker container |
| `db:reset`   | Remove container and volume          |
| `db:restart` | Restart Docker container             |

---

## License

This project is licensed under the **MIT License**.

---
