FROM python:3.10

ENV APP_HOME /app
RUN mkdir -p ${APP_HOME}

WORKDIR ${APP_HOME}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y build-essential \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip

COPY ./requirements.txt ${APP_HOME}/requirements.txt
COPY ./static /app/staticfiles

RUN pip3 install -r requirements.txt
RUN pip3 install django-user-sessions
RUN pip3 install django-cors-headers

COPY . /app/

COPY ./start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

CMD python manage.py migrate --no-input && \
    python manage.py collectstatic --no-input && \
    python manage.py runserver 0.0.0.0:8000


