FROM eclipse-temurin:17-jdk-alpine

WORKDIR /server

# Copy the jar you committed (named velocity.jar)
COPY velocity.jar server.jar

# Copy configs and assets
COPY velocity.toml ./velocity.toml
COPY forwarding.secret ./forwarding.secret
COPY plugins ./plugins
COPY server-icon.png ./server-icon.png

EXPOSE 25567

CMD ["java", "-jar", "server.jar"]
