.PHONY: run help format lint lint-fix

PORT ?= 8000
HOST ?= 0.0.0.0
RELOAD ?= --reload

RUFF_TARGET ?= src

help:
	@echo "Available commands:"
	@echo "  make run        - Run the FastAPI application with Uvicorn (reloads on code change)"
	@echo "  make format     - Format code using Ruff"
	@echo "  make lint       - Lint code using Ruff"
	@echo "  make lint-fix   - Lint and automatically fix code using Ruff"
	@echo "  make help       - Show this help message"
	@echo ""
	@echo "You can override default variables, e.g.:"
	@echo "  make run PORT=8001 HOST=127.0.0.1 RELOAD="
	@echo "  (Set RELOAD to empty string to disable auto-reload)"
	@echo "  make format RUFF_TARGET=./src/geoportal/my_specific_module"

run:
	@echo "Starting Geoportal FastAPI application on http://$(HOST):$(PORT)..."
	poetry run uvicorn src.geoportal.main:app --host $(HOST) --port $(PORT) $(RELOAD)

format:
	@echo "Formatting code with Ruff for: $(RUFF_TARGET)..."
	poetry run ruff format $(RUFF_TARGET)

lint:
	@echo "Linting code with Ruff for: $(RUFF_TARGET)..."
	poetry run ruff check $(RUFF_TARGET)

lint-fix:
	@echo "Linting and fixing code with Ruff for: $(RUFF_TARGET)..."
	poetry run ruff check --fix $(RUFF_TARGET)
