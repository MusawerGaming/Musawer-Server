# Dockerfile.koyeb for deploying on Koyeb
FROM openjdk:11-jre-slim

# Set the working directory inside the container
WORKDIR /app

# Copy all project files into /app in the container
COPY . /app

# (Optional) Expose the port used by your BungeeCord server or your application
# Replace 25565 with the actual internal port if different.
EXPOSE 25565

# Make sure main.sh is executable
RUN chmod +x main.sh

# Command to run the main.sh script when the container starts
CMD ["./main.sh"]
