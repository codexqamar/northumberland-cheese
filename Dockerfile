FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set ignore-scripts true && \
    npm config set fund false && \
    npm install --no-audit --no-fund --ignore-engines

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.mjs ./server.mjs

RUN npm config set ignore-scripts true && \
    npm config set fund false && \
    npm install --no-audit --no-fund --omit=dev --omit=optional --ignore-engines

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "server.mjs"]
