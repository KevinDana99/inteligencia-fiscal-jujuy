# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_USE_MOCK_AUTH=false
ARG NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL=false
ARG NEXT_PUBLIC_USE_MOCK_CATALOG_SHOWCASE=true

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_USE_MOCK_AUTH=$NEXT_PUBLIC_USE_MOCK_AUTH
ENV NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL=$NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL
ENV NEXT_PUBLIC_USE_MOCK_CATALOG_SHOWCASE=$NEXT_PUBLIC_USE_MOCK_CATALOG_SHOWCASE

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -n "$NEXT_PUBLIC_API_BASE_URL" || (echo "NEXT_PUBLIC_API_BASE_URL build arg is required" >&2; exit 1)
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]
