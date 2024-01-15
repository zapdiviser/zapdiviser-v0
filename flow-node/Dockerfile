FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm sucrase && pnpm i

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]
