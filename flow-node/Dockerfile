FROM node:20-alpine

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g pnpm sucrase && pnpm i

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
