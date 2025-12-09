FROM node:18-alpine

WORKDIR /app

# Install deps first for caching
COPY package.json .
RUN npm install --omit=dev

# Copy app code
COPY bridge.js .

ENV NODE_ENV=production

# Explicit container healthcheck
HEALTHCHECK CMD wget -qO- http://localhost:$PORT/ || exit 1

CMD ["node", "bridge.js"]
