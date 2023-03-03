# Hi, I'm Juan Rosero! 👋

+2 years experience as a Full-Stack Software Developer 🧑🏼‍💻. Improve performance of applications exceeding the
needs of the clients. Correctly plan the execution of new projects and maintenance of the existing ones.
Proactive mindset, always willing to learn and personal improvement 📈.

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://juanrosero.netlify.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/juan-jos%C3%A9-rosero-calder%C3%B3n-27564b203/)

## About This Project

This project simulates a small ride-hiring service. It is an API that allows you to log in, create a trip or finish it and that also makes an external call to a third-party API for the secure creation of a transaction. Each endpoint has validation of the requested fields and handles protection by JWT token and user ROLE. This API does NOT ask for any credit card information or sources of payment.

**Keywords:** Nestjs, Node, PostgreSQL, TypeORM, Docker, Testing, API Restful, Backend

## Before Starting

\*Only install if you will start server with **docker-compose\***

🐳 [Install Docker Desktop](https://www.docker.com/products/docker-desktop)

**Note:** After installation, open the Docker Desktop Shortcut and accept the terms and conditions.

## Environment Variables

To run this project, you will need to add a environment variables to your `.env` file. Follow `.exm.env` file but remember:

- `SECRET_KEY` JWT secret key

- `DB_HOST` with Docker Container must be `host.docker.internal` otherwise `localhost`

- `DB_NAME` if you created it since beginning all will be fine but if you don't please check [Troubleshooting With Docker-Compose](#-troubleshooting-with-docker-compose) section. **Note:** If you are not using docker-compose then you will have to create the database manually.

## Docker Environment

If you wanna use **docker-compose** to start the server you need to create a `docker.env` file an add some environment variables. Follow `docker.exm.env` file but remember:

- `PGADMIN_DEFAULT_EMAIL` is the email address that will be used to set up the initial admin account in pgAdmin.

* `PGADMIN_DEFAULT_PASSWORD` is the password that will be used to set up the initial admin account in pgAdmin.

* `POSTGRES_PASSWORD` sets the superuser password for PostgreSQL.

## ⚡ Run Locally

- Start server in dev mode using **docker-compose**

```bash
  npm run dev
```

- Start server in local without **docker-compose**

```bash
  npm install -E
```

```bash
  npm run migration:run && npm run start:dev
```

Now you can call the API

```http
  http://localhost:3000/api/v1
```

| Method | End Point                            | Body                                       |
| :----- | :----------------------------------- | :----------------------------------------- |
| POST   | `/auth/signin`                       | `password:string` , `email:string`         |
| POST   | `/riders/new-travel`                 | `lat_start:string` , `long_start:string`   |
| PUT    | `/drivers/finished-travel/:idTravel` | `lat_end` , `long_end`, `installments:int` |

**Note:** When you run the API for the first time it will automatically load a seed of dummy users and roles, but the values ​​of `id_payment_source` column in `riders` table must be changed for id of the tokenized payment sources in the external transaction API. For all users the dummy password is `123` 😉.

## 🕵️ Running Tests

- With **docker-compose**

```bash
  npm run unit-test
  npm run integration-test
```

- Without **docker-compose**

```bash
  npm run test
  npm run test:e2e
```

## 🧐 Troubleshooting With Docker-Compose

If at the time of starting the server you have defined a name for the database but it was not created, the console will show `error: database "mydb" does not exist`.

To solve this problem, go to pgAdmin on port `8080`, login with the credentials configured in `docker.env` and then create a local server with host `host.docker.internal`, remember, the default user is `postgres` and password is stored in `docker.env`.

After that, create the database with the name defined in the `.env`, for example in this case "mydb".

![Create DB - pgadmin](https://juanrosero.s3.us-east-2.amazonaws.com/public/create_db_pgadmin.gif)

Now you must re start the server, go to Docker Desktop, display the containers list and press START. After a few minutes, the server will start and the database will be seeded with dummy data ready for testing.
