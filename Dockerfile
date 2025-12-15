FROM eclipse-temurin:17-jdk-alpine

WORKDIR /server

# Copy the stable Velocity jar you committed
COPY velocity-3.2.0-SNAPSHOT-296.jar server.jar

# Copy configs and assets
COPY velocity.toml ./velocity.toml
COPY forwarding.secret ./forwarding.secret
COPY plugins ./plugins
COPY server-icon.png ./server-icon.png

# Expose Velocity port
EXPOSE 25567

# Start Velocity
CMD ["java", "-jar", "server.jar"]
