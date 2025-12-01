FROM node:20-slim AS builder

# 安装 pnpm
RUN npm install -g pnpm@9.15.0

WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml ./

# 使用 pnpm 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm run build

FROM node:20-slim AS runner

# 安装 pnpm
RUN npm install -g pnpm@9.15.0

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# 复制必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["pnpm", "start"]