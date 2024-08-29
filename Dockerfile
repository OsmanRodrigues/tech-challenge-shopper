FROM node:20-slim

WORKDIR /web-api/

COPY package*.json ./

RUN npm ci --silent

COPY . .

USER node

CMD npm run dev