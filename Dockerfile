FROM eclipse-temurin:17-jre

WORKDIR /velocity

# Copy Velocity runtime files into the working directory
COPY eagler-viaversion-files/ ./

# Copy startup script
COPY main.sh ./
RUN chmod +x main.sh

EXPOSE 25565

CMD ["./main.sh"]
