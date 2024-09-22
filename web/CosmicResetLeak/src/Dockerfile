FROM node:18

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

COPY ./app .

EXPOSE 5000

CMD ["node", "app.js"]
