# Stage 1: Build production assets
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve compiled html assets with dynamic port binding
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 80
CMD serve -s dist -l ${PORT:-80}
