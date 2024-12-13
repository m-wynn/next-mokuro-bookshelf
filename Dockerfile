FROM node:21@sha256:4b232062fa976e3a966c49e9b6279efa56c8d207a67270868f51b3d155c4e33d as base
WORKDIR /app

EXPOSE 3000

ENV PORT 3000

COPY ./src/package.json ./src/package-lock.json ./

RUN npm install --frozen-lockfile

COPY ./src/ .
RUN chown -R 1000:1000 /app
USER 1000

RUN mkdir -p /app/.next/cache/images \
    && chown -R 1000:1000 /app/.next/


FROM base as prod

RUN npx prisma generate && npm run build

CMD ["npm", "run", "start:migrate:prod"]

FROM base as dev

CMD ["npm", "run", "dev"]
