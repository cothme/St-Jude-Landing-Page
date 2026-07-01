FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

ENV PORT=8080
ENV NODE_ENV=production
ENV STATIC_DIR=/app/dist
ENV SITE_URL=https://st-jude-landing-page-production.up.railway.app

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY server ./server
COPY --from=build /app/src/content ./src/content

CMD ["node", "server/server.mjs"]
