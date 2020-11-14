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
