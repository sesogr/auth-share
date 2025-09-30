FROM docker.io/denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY . .

# Compile the main app
RUN deno install --allow-import
RUN deno cache --allow-import src/main.ts

# Run the app
ENTRYPOINT ["deno", "run", "--allow-net","--allow-env", "src/main.ts"]
