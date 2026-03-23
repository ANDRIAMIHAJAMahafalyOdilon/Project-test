FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
ENV NODE_ENV=development
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/src/server.js"]
