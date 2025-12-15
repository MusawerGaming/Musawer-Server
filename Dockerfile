# Use Java 17 (Velocity requires Java 17+)
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside the container
WORKDIR /server

# Copy your Velocity jar into the container and rename it to server.jar
COPY velocity.jar server.jar

# Copy all plugins into the plugins folder
COPY plugins ./plugins

# Expose the Velocity port
EXPOSE 25567

# Run Velocity
CMD ["java", "-jar", "server.jar"]
