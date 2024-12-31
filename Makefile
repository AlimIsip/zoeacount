ifneq (,$(wildcard ./.env))
include .env 
export
ENV_FILE_PARAM = --env-file .env
endif

build:
 sudo docker-compose up --build -d --remove-orphans

up:
 sudo docker-compose up -d

down:
 sudo docker-compose down

show-logs:
 sudo docker-compose logs

migrate:
 sudo docker-compose exec backend python3 manage.py migrate

makemigrations:
 sudo docker-compose exec backend python3 manage.py makemigrations

superuser:
 sudo docker-compose exec backend python3 manage.py createsuperuser

collectstatic:
 sudo docker-compose exec backend python3 manage.py collectstatic --no-input --clear

down-v:
 sudo docker-compose down -v