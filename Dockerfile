FROM node:18-slim

WORKDIR /app

COPY . .

RUN corepack enable && yarn install

EXPOSE 3000

CMD ["yarn", "dev"]
