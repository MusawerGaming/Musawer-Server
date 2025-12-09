FROM node:18-alpine

WORKDIR /app

# Install deps first for caching
COPY package.json .
RUN npm ci --only=prod

# Copy app code
COPY bridge.js .

CMD ["node", "bridge.js"]
