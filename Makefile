ENV_FILE_DEV      ?= backend/.env
ENV_FILE_PROD     ?= /etc/ingo360/env.backend
ENV_FILE_FRONTEND ?= /etc/ingo360/env.frontend

COMPOSE_DEV  = docker/compose.dev.yml
COMPOSE_PROD = docker/compose.prod.yml

ifeq ($(shell uname 2>/dev/null), Linux)
  BUILDKIT := DOCKER_BUILDKIT=1
else
  BUILDKIT :=
endif

.PHONY: dev-build dev-up dev-down dev-stop dev-restart dev-logs \
        prod-build prod-up prod-down prod-stop prod-restart prod-logs \
        migrate migrate-dev ps

# ── Dev ──────────────────────────────────────────────────────────────────────

dev-build:
	$(BUILDKIT) docker build -f docker/Dockerfile.backend.dev  -t ingo360-backend:dev  ./backend
	$(BUILDKIT) docker build -f docker/Dockerfile.frontend.dev -t ingo360-frontend:dev ./frontend

dev-up: dev-build
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE_DEV) up -d

dev-down:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE_DEV) down

dev-stop:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE_DEV) stop

dev-restart:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE_DEV) restart

dev-logs:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE_DEV) logs -f

# ── Prod ─────────────────────────────────────────────────────────────────────

prod-build:
	$(BUILDKIT) docker build -f docker/Dockerfile.backend.prod -t ingo360-backend:prod ./backend
	$(BUILDKIT) docker build -f docker/Dockerfile.frontend.prod \
		$(shell grep -v '^#' $(ENV_FILE_FRONTEND) | grep VITE_ | sed 's/^/--build-arg /') \
		-t ingo360-nginx:prod ./frontend

prod-up: prod-build
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE_PROD) up -d

prod-down:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE_PROD) down

prod-stop:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE_PROD) stop

prod-restart:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE_PROD) restart

prod-logs:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE_PROD) logs -f

# ── Database ─────────────────────────────────────────────────────────────────

migrate:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE_PROD) exec back alembic upgrade head

migrate-dev:
	docker compose -f $(COMPOSE_DEV) --env-file $(ENV_FILE_DEV) exec back alembic upgrade head

# ── Misc ─────────────────────────────────────────────────────────────────────

ps:
	docker compose -f $(COMPOSE_PROD) --env-file $(ENV_FILE_PROD) ps
