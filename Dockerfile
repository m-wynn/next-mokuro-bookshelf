FROM node:24@sha256:20988bcdc6dc76690023eb2505dd273bdeefddcd0bde4bfd1efe4ebf8707f747 as base
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
