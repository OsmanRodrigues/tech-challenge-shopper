FROM node:20-alpine

WORKDIR /web-api/

COPY . .

RUN npm install
RUN npm run build

COPY . .

EXPOSE 5000

CMD npm start