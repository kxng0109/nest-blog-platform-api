# Blog Platform API

A RESTful API built with [NestJS](https://nestjs.com/) for a blog platform that supports authentication, role-based access control, blog posts, comments, and more.

---

## Features

* User authentication using JWT (access and refresh tokens)
* Role-based authorization (`USER`, `ADMIN`)
* CRUD operations for blog posts and comments
* End-to-end testing using [Pactum](https://pactumjs.github.io/)
* PostgreSQL database
* Prisma as ORM
* Data validation using DTOs and Pipes
* Security best practices via Helmet, rate limiting, etc.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kxng0109/nest-blog-platform-api.git
cd nest-blog-platform-api
```

### 2. Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file at the root with the following:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blog_db
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Also create a `.env.test` file for the test environment.


## Testing

### Run End-to-End Tests

```bash
npm run test:e2e
```

This runs the tests defined in the `test/` directory using Pactum.

---

## Security Features

* Passwords are hashed with `bcrypt`
* JWT-based authentication (access and refresh tokens)
* Role-based guards
* Input validation using DTOs and pipes
* Global route prefix (`/api`)
* Use of Helmet and rate limiting

---

## Notes

* Ensure your PostgreSQL database is running before starting the app or running tests.
* Adjust test timeouts if using remote databases or serverless options.
* Swagger integration can be added for API documentation if needed.

---
