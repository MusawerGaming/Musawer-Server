FROM openjdk:17-jdk-slim
WORKDIR /app
COPY server.jar velocity.toml forwarding.secret ./
EXPOSE 25565
CMD ["java", "-jar", "server.jar"]
