# Use an official base image with Java
FROM eclipse-temurin:17-jre

# Set working directory inside the container
WORKDIR /velocity

# Copy all project files into the container
COPY . .

# Expose the default Minecraft proxy port
EXPOSE 25565

# Run the startup script
CMD ["./main.sh"]
