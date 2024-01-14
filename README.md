# Next Mokuro Bookshelf

A bookshelf for your [mokuro](https://github.com/kha-white/mokuro)-scanned books



https://github.com/m-wynn/next-mokuro-bookshelf/assets/6320753/de017150-3b9c-4922-b43d-dee6ced129be



# Instructions

## Production Mode

1. Copy .env.example to .env
2. Edit any environment variables you desire (see below)
3. Run `docker compose -f docker-compose.<environment>.yml up -d` where environment is "dev" or "prod".
4. Upgrade your database with `docker compose exec next-mokuro-bookshelf npx prisma migrate deploy`
5. Create a new user. The first user will automatically get admin role.

## Environment Variables

- `DATABASE_URL` is a Postgresql database connection URL for [prisma](https://www.prisma.io/docs/orm/overview/databases/postgresql#connection-url). If you are using the one provided in the docker-compose yaml, ensure the username and password match the environment variables set for that.
- `IMAGE_PATH` is the path the images will be stored. I recommend using the path that is volume-mounted in the docker-compose yaml.
- `INVITE_CODE` is a secret variable that users need to know in order to sign up

In addition, the postgresql database included in the docker-compose will use:

- `POSTGRESQL_USER` the user that the application should use to connect
- `POSTGRESQL_PASSWORD` the password the application should use to connect

## Usage

1. Download, install, and run `mokuro` on your volumes via the instructions in [kha-white/mokuro](https://github.com/kha-white/mokuro)
2. Run the application and create an account
3. Navigate to `/admin/volumes` and upload a cover, the images, and `_ocr` json files.
4. Go back to the home page and start reading!

# Alternatives

- [ChristopherFritz/Mokuro-Bookshelf](https://github.com/ChristopherFritz/Mokuro-Bookshelf) is a static html page that tracks your state with localstorage
