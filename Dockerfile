FROM node:21 as base
WORKDIR /app
COPY . .

EXPOSE 3000

ENV PORT 3000

RUN npm install --frozen-lockfile
USER 1000

FROM base as prod

RUN npm run build

CMD ["npm", "run", "start"]

FROM base as dev

CMD ["npm", "run", "dev"]
