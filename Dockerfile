FROM eclipse-temurin:17-jdk

WORKDIR /velocity

COPY . .

EXPOSE 25565

CMD ["java", "-jar", "server.jar"]
