FROM eclipse-temurin:17-jre

WORKDIR /velocity

COPY eagler-viaversion-files/ ./
COPY main.sh ./
RUN chmod +x main.sh

EXPOSE 25565

CMD ["./main.sh"]
