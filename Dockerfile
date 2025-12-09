FROM node:18-alpine

WORKDIR /app

# Install deps first for caching
COPY package.json .
RUN npm install --omit=dev

# Copy app code
COPY bridge.js .

ENV NODE_ENV=production

CMD ["node", "bridge.js"]
