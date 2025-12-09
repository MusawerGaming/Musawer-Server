FROM ghcr.io/minekube/gate:latest
COPY config.yml /gate/config.yml
CMD ["/gate", "run", "--config", "/gate/config.yml"]
