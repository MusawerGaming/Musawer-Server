FROM ghcr.io/minekube/gate:latest
COPY config.yml /config.yml
ENV PORT=${PORT}
CMD ["/gate", "run", "--config", "/config.yml"]
