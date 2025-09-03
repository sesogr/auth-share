FROM docker.io/denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

# Compile the main app
RUN deno install

# Run the app

ENTRYPOINT ["deno", "run", "dev"]