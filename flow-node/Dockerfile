FROM node:20-alpine

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm sucrase && pnpm install

COPY . .

# RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
