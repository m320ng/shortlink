# 빌드 스테이지
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# .env.production을 .env로 복사
COPY .env.production .env
COPY ./prisma/schema.prod.prisma ./prisma/schema.prisma

# Prisma 클라이언트 생성
RUN npx prisma generate
RUN npm run build

# 실행 스테이지
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 나머지 파일들 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 권한 설정
RUN chown -R node:node /app && \
    chmod -R 755 /app

# node 사용자로 전환
USER node

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"] 