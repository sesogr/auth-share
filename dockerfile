FROM docker.io/denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY ./service/src .
# Compile the main app
RUN deno cache main.ts

# Run the app
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]
