FROM node:21 as base
WORKDIR /app

EXPOSE 3000

ENV PORT 3000

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

USER 1000

COPY . .


FROM base as prod

RUN npm run build

CMD ["npm", "run", "start"]

FROM base as dev

CMD ["npm", "run", "dev"]
