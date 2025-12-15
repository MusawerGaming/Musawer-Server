FROM eclipse-temurin:17-jdk-alpine

WORKDIR /server

# Download Velocity proxy
ADD https://versions.velocitypowered.com/download/3.4.0-SNAPSHOT.jar server.jar

# Copy plugins into container
COPY plugins ./plugins

EXPOSE 25567

CMD ["java", "-jar", "server.jar"]
