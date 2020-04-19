# Fastfeet - backend
This repository contains the backend of the application Fastfeet, a fake transport app. The application is the final challenge of the bootcamp gostack, focused on the stack nodejs for backend, reactjs for web interface and react-native for mobile app . This application is not inteded to be safe neither to be used on a real situation.

Its web interface and mobile app can be found at:

- [Fastfeet - web](https://github.com/pnsidou/fastfeet_web)
- [Fastfeet - mobile](https://github.com/pnsidou/fastfeet_mobile)

## Usage:
Clone the repository, cd into it and run yarn to download its dependencies.
```
git clone https://github.com/pnsidou/fastfeet_backend.git
cd fastfeet_backend
yarn
```
### Database configuration:
This app make use of a posgresql database. Make sure you have one running and  configure it trough the respective environment variables on the .env file. You can just rename the .env.example and replace the values with your personal ones.
```
DB_USER=postgres_username
DB_PASS=postgres_password
DB_HOST=postgres_host
DB_NAME=database_name
```

### Database migrations:
To populate the database with the needed tables, you should run the sequelize migrations:
```
yarn sequelize migrate:all
```
### Database seeds:
By default, there's one admin user, admin@fastfeet.com with password 123456, defined in a sequelize seed. You can
use it by running the seed o you can create another one with a postgresql client. There's no route for adding admin users
on the backend itself. The command to run the seed is:

```
yarn sequelize db:seeds:all
```

### JWT secret
The authentication of admin users is made with JWT tokens. Its generation requires a personal secret, defined in the variable APP_SECRET
```
APP_SECRET=your_personal_secret
```

## Running
To start the server in development mode, you can issue the commands:
```
yarn dev
```
Or, if you want to launch node with the --inspect flag, for debugging purposes:
```
yarn dev:debug
```
Development mode uses nodemon to watch for changes in you source code files and restart the server
on the fly, as soon as a modification is made. If you don't need this, you can simply
run:
```
node src/server/js
```
