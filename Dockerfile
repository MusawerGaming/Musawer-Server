FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY bridge.js ./
ENV SERVER=example.com:0000
EXPOSE 8080
CMD ["npm", "start"]
