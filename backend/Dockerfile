# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

CMD ["node", "server.js"]
