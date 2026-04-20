FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install all dependencies (including dev)
RUN npm install --prefer-offline --no-audit

# Copy source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Expose port
EXPOSE 3000

# Start application using ts-node directly from source
CMD ["npx", "ts-node", "src/server.ts"]
