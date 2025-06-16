.PHONY: run help

PORT ?= 8000
HOST ?= 0.0.0.0
RELOAD ?= --reload

help:
	@echo "Available commands:"
	@echo "  make run        - Run the FastAPI application with Uvicorn (reloads on code change)"
	@echo "  make help       - Show this help message"
	@echo ""
	@echo "You can override default variables, e.g.:"
	@echo "  make run PORT=8001 HOST=127.0.0.1 RELOAD="
	@echo "  (Set RELOAD to empty string to disable auto-reload)"

run:
	@echo "Starting Geoportal FastAPI application on http://$(HOST):$(PORT)..."
	poetry run uvicorn src.geoportal.main:app --host $(HOST) --port $(PORT) $(RELOAD)
