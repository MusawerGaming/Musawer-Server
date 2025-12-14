FROM eclipse-temurin:17-jre

WORKDIR /velocity

COPY eagler-viaversion-files/ ./
COPY main.sh ./
RUN chmod +x main.sh

# Expose Minecraft + HTTP healthcheck ports
EXPOSE 25565 10000

# Start Velocity AND a dummy HTTP server
CMD ["sh", "-c", "./main.sh & httpd -f -p 10000"]
