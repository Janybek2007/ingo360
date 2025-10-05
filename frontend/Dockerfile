FROM oven/bun:alpine AS builder

WORKDIR /app

COPY bun.lock* package.json ./

RUN bun install --frozen-lockfile

COPY . .

ARG VITE_API_URL
ARG VITE_API_VERSION

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_VERSION=${VITE_API_VERSION}

RUN bun run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start"]
