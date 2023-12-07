FROM node:18-alpine
WORKDIR /app
COPY . .

# COPY ./.env ./

RUN npm install --frozen-lockfile
RUN npm run build

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]