ENV_FILE ?= backend/.env

COMPOSE_DEV  = docker/compose.dev.yml
COMPOSE_PROD = docker/compose.prod.yml

.PHONY: dev-build dev-up dev-down dev-stop dev-restart dev-logs \
        prod-build prod-up prod-down prod-stop prod-restart prod-logs \
        migrate migrate-dev ps

# ── Dev ──────────────────────────────────────────────────────────────────────

dev-build:
	DOCKER_BUILDKIT=1 docker build -f docker/Dockerfile.backend.dev  -t ingo360-backend:dev  ./backend
	DOCKER_BUILDKIT=1 docker build -f docker/Dockerfile.frontend.dev -t ingo360-frontend:dev ./frontend

dev-up: dev-build
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE) up -d

dev-down:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE) down

dev-stop:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE) stop

dev-restart:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE) restart

dev-logs:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE) logs -f

# ── Prod ─────────────────────────────────────────────────────────────────────

prod-build:
	DOCKER_BUILDKIT=1 docker build -f docker/Dockerfile.backend.prod  -t ingo360-backend:prod ./backend
	DOCKER_BUILDKIT=1 docker build -f docker/Dockerfile.frontend.prod -t ingo360-nginx:prod   ./frontend

prod-up: prod-build
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE) up -d

prod-down:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE) down

prod-stop:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE) stop

prod-restart:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE) restart

prod-logs:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE) logs -f

# ── Database ─────────────────────────────────────────────────────────────────

migrate:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE) exec back alembic upgrade head

migrate-dev:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE) exec back alembic upgrade head

# ── Misc ─────────────────────────────────────────────────────────────────────

ps:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE) ps
