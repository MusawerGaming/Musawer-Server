# Use an official base image with Java
FROM eclipse-temurin:17-jre

# Set working directory inside the container
WORKDIR /velocity

# Copy everything into the container
COPY . .

# Expose the default Minecraft proxy port
EXPOSE 25565

# Run the startup script
CMD ["./main.sh"]

 



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
FROM eclipse-temurin:17-jdk

WORKDIR /velocity

COPY eagler-viaversion-files/server.jar .
COPY eagler-viaversion-files/v
