# mrchelsinki

## Starting the backend

To start the API server with `ts-node-dev`:

```sh
npm run start:dev
```

The server port defaults to port 5000 if nothing else is specified in environment variable `SERVER_PORT`. This means, yo can access backend at `http://localhost:5000/api`

## Environment variables

Fill in the environment variables found in .env.sample file of both [client](./client/.env.sample) and [server](./server/.env.sample) and make sure they are readable by NodeJS. I personally prefer [direnv](https://direnv.net/) for easy environment variable management.
