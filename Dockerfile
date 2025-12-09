FROM ghcr.io/minekube/gate:latest
COPY config.yml /etc/gate/config.yml
CMD ["/gate", "run", "--config", "/etc/gate/config.yml"]
