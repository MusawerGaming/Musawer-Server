FROM node:18-alpine
WORKDIR /app
COPY bridge.js .
RUN npm install ws
CMD ["node", "bridge.js"]
