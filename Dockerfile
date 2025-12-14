FROM eclipse-temurin:17-jre

WORKDIR /velocity

COPY eagler-viaversion-files/ ./
COPY main.sh ./
COPY healthcheck.py ./
RUN chmod +x main.sh

EXPOSE 25565 8000

CMD ["sh", "-c", "./main.sh & python3 healthcheck.py"]
