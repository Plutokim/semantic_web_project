docker compose down --remove-orphans
docker compose up -d --build
docker compose exec -it backend /bin/bash