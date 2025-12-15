FROM eclipse-temurin:17-jdk-alpine

# Install Node environment
RUN apk add --no-cache nodejs npm

WORKDIR /server

# Copy and setup files
COPY . .
# Rename for bridge.js consistency
RUN mv velocity.jar server.jar || true
RUN npm install

# Expose Render's assigned port
EXPOSE 10000

# Start only the bridge (it will spawn Velocity automatically)
CMD ["node", "bridge.js"]
