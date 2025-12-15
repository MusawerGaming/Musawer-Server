# Use Java 17 for Velocity
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /server

# Copy Velocity jar
COPY velocity.jar server.jar

# Copy plugins
COPY plugins ./plugins

# Copy Velocity config + secret
COPY velocity.toml ./velocity.toml
COPY forwarding.secret ./forwarding.secret

# Copy bridge files
COPY package.json package-lock.json* ./
RUN apk add --no-cache nodejs npm
RUN npm install
COPY bridge.js ./bridge.js

# Expose both ports
EXPOSE 25567 8080

# Run both Velocity and the bridge
CMD java -jar server.jar & node bridge.js
