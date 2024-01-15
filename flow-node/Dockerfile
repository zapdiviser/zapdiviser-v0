FROM node:21-alpine

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm i -g sucrase

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
