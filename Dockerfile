# Use Java 17 (Velocity requires Java 17+)
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside the container
WORKDIR /server

# Copy your Velocity jar (renamed to velocity.jar in your repo)
COPY velocity.jar server.jar

# Copy plugins into the container
COPY plugins ./plugins

# Copy Velocity configuration file
COPY velocity.toml ./velocity.toml

# Expose the Velocity port
EXPOSE 25567

# Run Velocity
CMD ["java", "-jar", "server.jar"]
