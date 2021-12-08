# NodeJS Express Boilerplate
## NodeJS Express Rest API Boilerplate / Ready To Use. 
![example](https://res.cloudinary.com/killtdj/image/upload/v1638974690/nodejs_ztrkrv.png)
### Tech Stack :
- [Postgresql](https:postgresql.org)
- [Sequelize](https://sequelize.org)
- [JWT Authentication](https://jwt.io)
- [API Documentation (Swagger)](https://swagger.io)
- [Cloudinary Storage](https://cloudinary.com)
- [Redis](https://redis.io)
- [Bull](https://github.com/OptimalBits/bull)

### Feature
- Login with JWT Authentication
- Signup with email notification
- Guard API with JWT Auth Guard
- Upload Image / File to [Cloudinary](https://cloudinary.com)
- Use Redis Bull for Queue Job
- Sequelize Migration
- Use Pino for Logging

### How To Install
1. Clone This Repo
```bash
git clone https://github.com/danudenny/nodejs-boilerplate
```

2. Install Package
```bash
# NPM
npm install

# Yarn
yarn install

```

3. Copy `.env.example` to `.env`
4. Populate `.env`
- App dan Database
```ts
PORT = 3000
DEV_DATABASE_URL = postgres://<db_user>:<db_password>@127.0.0.`:5432/<db_name>
DATABASE_URL = postgres://<db_user>:<db_password>@127.0.0.1:5432/<db_name>
NODE_ENV = development
```

- Mail
```ts
ADMIN_EMAIL = email@email.com
MAIL_USERNAME = username
MAIL_PASSWORD = password
MAIL_HOST = smtp.mailtrap.io
MAIL_PORT = 2525
```

- JWT
```
JWT_SECRET = <jsonwebtokensecret>
```

- Cloudinary
```ts
CLOUD_NAME= <cloudynaryname>
API_KEY= <cloudynaryAPIKey>
API_SECRET= <cloudynaryAPISecret>
```

5. Set Environment Development `database/config/config.js`
6. Start The API `yarn start` or `yarn start:dev`


## Postman Documentation

[Link Postman Documentation](https://documenter.getpostman.com/view/3229558/UVJkBDPg)
