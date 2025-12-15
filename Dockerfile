FROM eclipse-temurin:17-jdk-alpine

WORKDIR /server

# Download stable Velocity build #296 directly
ADD https://papermc.io/api/v2/projects/velocity/versions/3.2.0-SNAPSHOT/builds/296/download server.jar

# Copy configs and assets
COPY velocity.toml ./velocity.toml
COPY forwarding.secret ./forwarding.secret
COPY plugins ./plugins
COPY server-icon.png ./server-icon.png

# Expose Velocity port
EXPOSE 25567

# Start Velocity
CMD ["java", "-jar", "server.jar"]
