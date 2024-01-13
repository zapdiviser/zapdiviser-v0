FROM node:20

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm && NODE_ENV=development pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
