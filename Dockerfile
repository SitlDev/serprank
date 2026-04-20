FROM node:20

WORKDIR /app

COPY backend/package*.json ./

RUN npm install --legacy-peer-deps

COPY backend .

# Build TypeScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/server.js"]
