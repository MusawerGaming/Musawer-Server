FROM caddy:2.8.4-alpine

WORKDIR /server

# Copy Velocity files
COPY velocity.jar server.jar
COPY velocity.toml ./velocity.toml
COPY forwarding.secret ./forwarding.secret
COPY plugins ./plugins
COPY server-icon.png ./server-icon.png

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Install Java
RUN apk add --no-cache openjdk17

EXPOSE 80 443 25567

# Run both Velocity and Caddy
CMD java -jar /server/server.jar & caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
