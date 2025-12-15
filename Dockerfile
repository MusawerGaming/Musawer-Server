# Use Java 17 for Velocity
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /server

# Copy Velocity proxy jar
COPY velocity.jar server.jar

# Copy Velocity config and secret
COPY velocity.toml ./velocity.toml
COPY forwarding.secret ./forwarding.secret

# Copy optional server icon
COPY server-icon.png ./server-icon.png

# Copy plugins folder
COPY plugins ./plugins

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Copy Node bridge files
COPY package.json package-lock.json* ./
RUN npm install
COPY bridge.js ./bridge.js

# Expose Velocity port and WebSocket bridge port
EXPOSE 25567 10000

# Run Node.js bridge as main process (it spawns Velocity internally)
CMD ["node", "bridge.js"]
