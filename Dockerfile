# Build Stage
FROM node:20-buster-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Create and change to the backend directory.
WORKDIR /usr/src/app/backend

# Copy backend dependency manifests to the container image.
COPY backend/package.json backend/pnpm-lock.yaml* ./

# Install dependencies.
RUN pnpm install --frozen-lockfile

# Copy backend code to the container image.
COPY backend/ ./

# Build nest.js app
RUN pnpm run build


# Create and change to the frontend directory.
WORKDIR /usr/src/app/frontend

# Copy frontend dependency manifests to the container image.
COPY frontend/package.json frontend/pnpm-lock.yaml* ./

# Install dependencies.
RUN pnpm install --frozen-lockfile

# Copy frontend code
COPY frontend/ ./

# Set NODE_ENV to ensure correct environment is used when building
ENV NODE_ENV=production

# Build frontend
RUN pnpm run build


# Run stage
FROM node:20-buster-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        make \
        nginx \
        supervisor \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/supervisor

# Create a Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /usr/src/app

# Set PORT environment that is used by the frontend
ENV PORT=4200

# Copy relevant files for running backend and frontend
COPY --from=builder /usr/src/app/backend/dist ./backend/dist/
COPY --from=builder /usr/src/app/backend/node_modules ./backend/node_modules/
COPY --from=builder /usr/src/app/frontend/.next/standalone ./frontend/
COPY --from=builder /usr/src/app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /usr/src/app/frontend/public ./frontend/public

# Create a Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf


# Expose nginx port
EXPOSE 80/tcp

# Run Supervisor to manage all processes
CMD ["/usr/bin/supervisord"]
