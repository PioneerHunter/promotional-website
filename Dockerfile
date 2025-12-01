FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

FROM node:20-slim AS runner
ENV NODE_ENV production
ENV PORT 3000
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
CMD ["pnpm", "start"]