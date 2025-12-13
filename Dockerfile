 HEAD
# Use an official base image with Java
FROM eclipse-temurin:17-jre

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy everything from the current directory to /app in the container
COPY . .

# Make sure main.sh is executable
RUN chmod +x main.sh

# Command to run the main.sh script
CMD ["./main.sh"]
=======
FROM eclipse-temurin:17-jdk

WORKDIR /velocity

COPY eagler-viaversion-files/server.jar .
COPY eagler-viaversion-files/velocity.toml .
COPY eagler-viaversion-files/forwarding.secret .

EXPOSE 25565

CMD ["java", "-jar", "server.jar"]
 6fa0cd1f2b9a5972da9a4098e67770b2acea387d
