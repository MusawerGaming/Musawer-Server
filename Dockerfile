FROM eclipse-temurin:17-jdk-alpine

WORKDIR /server

COPY velocity.jar server.jar
COPY plugins ./plugins
COPY velocity.toml ./velocity.toml
COPY forwarding.secret ./forwarding.secret

# Install Node.js
RUN apk add --no-cache nodejs npm

# Copy bridge
COPY package.json package-lock.json* ./
RUN npm install
COPY bridge.js ./bridge.js

EXPOSE 10000 25567

# Run Node (which spawns Velocity)
CMD ["node", "bridge.js"]
