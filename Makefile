ifneq (,$(wildcard ./.env))
include .env
export
ENV_FILE_PARAM = --env-file .env
endif

build:
	docker-compose up --build -d --remove-orphans

up:
	docker-compose up -d

down:
	docker-compose down

show-logs:
	docker-compose logs

migrate:
	docker-compose exec backend python3 manage.py migrate

makemigrations:
	docker-compose exec backend python3 manage.py makemigrations

superuser:
	docker-compose exec backend python3 manage.py createsuperuser

collectstatic:
	docker-compose exec backend python3 manage.py collectstatic --no-input --clear

# brings down containers and removes all the volume
down-v:
	docker-compose down -v
