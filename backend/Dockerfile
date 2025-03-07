FROM node:22 AS builder
WORKDIR /build
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:22-slim AS runner
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY --from=builder build/package*.json .
COPY --from=builder build/dist .
COPY --from=builder build/.env .

RUN npm install --only=production

USER node
CMD ["node", "src/app.js"]