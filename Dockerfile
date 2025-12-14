# Base image: lightweight Java runtime
FROM eclipse-temurin:17-jre

# Set working directory
WORKDIR /velocity

# Copy server files
COPY eagler-viaversion-files/ ./
COPY main.sh ./
RUN chmod +x main.sh

# Install BusyBox (tiny HTTP server)
RUN apt-get update && apt-get install -y busybox && rm -rf /var/lib/apt/lists/*

# Expose Minecraft + dummy HTTP port
EXPOSE 25565 10000

# Start Velocity AND BusyBox HTTP server
CMD ["sh", "-c", "./main.sh & busybox httpd -f -p 10000"]
