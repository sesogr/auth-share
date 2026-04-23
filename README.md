# Quickstart

## Run dev build on Localhost

1. run the docker-compose.yml via docker-compose / podman-compose
2. open localhost:3000 in browser

## Development

1. `deno run hooks:install`
2. `cd web`
3. `deno install` (to install vite dependencies)

# Known Issues

- column mismatches over versions aren't automatically resolved
  - for test builds deleting the old database volume and restarting the
    containers resolves this
- SELinux blocks podman-compose volume mapping
  - add :z to volume mappings (either in the ide settings, or in the
    docker-compose file)
