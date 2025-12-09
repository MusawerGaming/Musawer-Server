FROM ghcr.io/minekube/gate:latest
COPY config.yml /config.yml
ENV PORT=10000
CMD ["/gate", "run", "--config", "/config.yml"]
