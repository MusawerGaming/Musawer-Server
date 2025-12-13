FROM eclipse-temurin:17-jre

WORKDIR /velocity
COPY eagler-viaversion-files/ ./
COPY main.sh ./
RUN chmod +x main.sh

# Install Node.js for dummy healthcheck
RUN apt-get update && apt-get install -y nodejs npm

COPY healthcheck.js ./

EXPOSE 25565 10000

CMD ["sh", "-c", "./main.sh & node healthcheck.js"]
