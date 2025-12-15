FROM eclipse-temurin:17-jdk-alpine

WORKDIR /server

# Copy Velocity jar
COPY velocity.jar server.jar

# Copy configs and assets
COPY velocity.toml ./velocity.toml
COPY forwarding.secret ./forwarding.secret
COPY plugins ./plugins
COPY server-icon.png ./server-icon.png

# Install Node.js for bridge
RUN apk add --no-cache nodejs npm

# Copy bridge files
COPY package.json package-lock.json* ./
RUN npm install
COPY bridge.js ./bridge.js

# Expose ports
EXPOSE 25567 10000

# Start Node bridge (which spawns Velocity)
CMD ["node", "bridge.js"]
