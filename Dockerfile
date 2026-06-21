# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production
RUN npm install @nestjs/cli -g

COPY . .

RUN npm run build

# ---------- Второй этап ----------
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache tzdata

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

COPY .env .env


EXPOSE 5000

CMD ["node", "dist/main"]