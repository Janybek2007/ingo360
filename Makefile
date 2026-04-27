ENV_FILE_FRONTEND ?= /etc/ingo360/frontend.env

COMPOSE_DEV  = docker/compose.dev.yml
COMPOSE_PROD = docker/compose.prod.yml

ifeq ($(shell uname 2>/dev/null), Linux)
  BUILDKIT := DOCKER_BUILDKIT=1
else
  BUILDKIT :=
endif

.PHONY: dev-build dev-up dev-down dev-stop dev-restart dev-logs \
        prod-build db-build prod-up prod-down prod-stop prod-restart prod-logs \
        migrate migrate-dev ps

# ── Dev ──────────────────────────────────────────────────────────────────────

dev-build:
	$(BUILDKIT) docker build -f docker/Dockerfile.backend.dev  -t ingo360-backend:dev  ./backend
	$(BUILDKIT) docker build -f docker/Dockerfile.frontend.dev -t ingo360-frontend:dev ./frontend

dev-up: dev-build
	docker compose -f $(COMPOSE_DEV) up -d
	docker compose -f $(COMPOSE_DEV) restart nginx

dev-down:
	docker compose -f $(COMPOSE_DEV) down

dev-stop:
	docker compose -f $(COMPOSE_DEV) stop

dev-restart:
	docker compose -f $(COMPOSE_DEV) restart

dev-logs:
	docker compose -f $(COMPOSE_DEV) logs -f

# ── Prod ─────────────────────────────────────────────────────────────────────

db-build:
	$(BUILDKIT) docker build -f docker/Dockerfile.postgres.prod -t ingo360-db:prod .

prod-build: db-build
	$(BUILDKIT) docker build -f docker/Dockerfile.backend.prod -t ingo360-backend:prod ./backend
	$(BUILDKIT) docker build -f docker/Dockerfile.frontend.prod \
		$(shell grep -v '^#' $(ENV_FILE_FRONTEND) | grep VITE_ | sed 's/^/--build-arg /') \
		-t ingo360-nginx:prod ./frontend

prod-up: prod-build
	docker compose -f $(COMPOSE_PROD) up -d
	docker compose -f $(COMPOSE_PROD) restart nginx

prod-down:
	docker compose -f $(COMPOSE_PROD) down

prod-stop:
	docker compose -f $(COMPOSE_PROD) stop

prod-restart:
	docker compose -f $(COMPOSE_PROD) restart

prod-logs:
	docker compose -f $(COMPOSE_PROD) logs -f

# ── Database ─────────────────────────────────────────────────────────────────

migrate:
	docker compose -f $(COMPOSE_PROD) exec back alembic upgrade head

migrate-dev:
	docker compose -f $(COMPOSE_DEV) exec back alembic upgrade head

# ── Misc ─────────────────────────────────────────────────────────────────────

ps:
	docker compose -f $(COMPOSE_PROD) ps
