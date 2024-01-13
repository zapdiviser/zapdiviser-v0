FROM node:20-alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
