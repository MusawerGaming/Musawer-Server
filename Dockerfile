FROM eclipse-temurin:17-jdk-alpine

WORKDIR /server

# Copy Velocity files
COPY velocity.jar server.jar
COPY velocity.toml ./velocity.toml
RUN echo "=== forced-hosts block ===" && grep -A2 " \[forced-hosts\] " ./velocity.toml
COPY forwarding.secret ./forwarding.secret
COPY plugins ./plugins
COPY server-icon.png ./server-icon.png

# Install Node.js
RUN apk add --no-cache nodejs npm

# Copy bridge files
COPY package.json package-lock.json* ./
RUN npm install
COPY bridge.js ./bridge.js

# Expose ports
EXPOSE 25567 10000

# Run Node bridge (spawns Velocity internally)
CMD ["node", "bridge.js"]





