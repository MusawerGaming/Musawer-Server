FROM eclipse-temurin:17-jdk-alpine
RUN apk add --no-cache nodejs npm
WORKDIR /server
COPY . .
RUN mv velocity.jar server.jar || true
RUN npm install ws
EXPOSE 10000
CMD ["node", "bridge.js"]
