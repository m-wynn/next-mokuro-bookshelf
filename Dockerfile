FROM node:21 as base
WORKDIR /app

EXPOSE 3000

ENV PORT 3000

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .


FROM base as prod

RUN npx prisma generate && npm run build

USER 1000

CMD ["./entrypoint.sh"]

FROM base as dev

USER 1000

CMD ["npm", "run", "dev"]
