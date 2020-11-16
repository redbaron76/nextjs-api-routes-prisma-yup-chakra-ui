# React Query real-time refetch example<br/>with Socket.io (v3) and Next.js API Routes (v10.0.x)

## NEW UPDATE

This boilerplate now implements **Socket.io** in **Next.js API routes** to give RT functionalities to **React Query**.

- A custom **useQuerySocket** hook takes care to subscribe to a socket.io event name with the same value of the **cache key**.
- **On the server**, notifications are emitted by the REST method when a new user has been created.
- **On the client**, the hook is listening for any message emitted by the server, performing a new **refetch** for all the queries that are using the same cache key.

**TRY IT IN ACTION:**

1. Open two different browser windows and register a new user in one of them.

2. The second browser window will refresh user's list in **real-time**

## What is it?

This is an experimental full-stack boilerplate which puts together **Next.js** v10.0.1, **API routes** and **Prisma v2** as backend + **Yup** schema for server-side validation and **Chakra UI** + **react-query** on the frontend.

Prisma v2 connects to a **PostgreSQL** database provided by the docker-compose file

## Getting Started

Clone this repo and take care to have **docker-compose** installed and **Docker** daemon up and running in your DEV machine.

Then:

```bash
# build and run Postgres db
docker-compose up --build

# install dependencies
yarn install

# migrate Prisma schema to db
yarn prisma migrate up --experimental

# generate Prisma client
yarn prisma generate

# run dev server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
