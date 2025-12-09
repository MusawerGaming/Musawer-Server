FROM ghcr.io/minekube/gate:latest
COPY config.yml /config.yml
CMD ["/gate", "run", "--config", "/config.yml"]
