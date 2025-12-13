FROM eclipse-temurin:17-jdk

WORKDIR /velocity

COPY eagler-viaversion-files/server.jar .
COPY eagler-viaversion-files/velocity.toml .
COPY eagler-viaversion-files/forwarding.secret .

EXPOSE 25565

CMD ["java", "-jar", "server.jar"]
