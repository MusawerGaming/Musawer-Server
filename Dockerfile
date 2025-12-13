FROM openjdk:17-jdk-slim

WORKDIR /velocity

COPY . .

EXPOSE 25565

CMD ["java", "-jar", "server.jar"]
