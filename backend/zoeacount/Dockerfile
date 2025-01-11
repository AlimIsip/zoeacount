FROM python:3.10

ENV APP_HOME /app
RUN mkdir -p ${APP_HOME}

WORKDIR ${APP_HOME}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y build-essential libgl1 libglib2.0-0 \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip

COPY ./requirements.txt ${APP_HOME}/requirements.txt

RUN pip3 install -r requirements.txt
RUN pip3 install django-user-sessions
RUN pip3 install django-cors-headers
RUN pip3 install djangorestframework
RUN pip3 install markdown
RUN pip3 install django-filter
RUN pip3 install opencv-python
RUN pip3 install opencv-contrib-python
RUN pip3 install imutils
RUN pip3 install opencv-python

COPY . /app/

COPY ./start /start
RUN sed -i 's/\r$//g' /start
sRUN chmod +x /start

CMD python manage.py migrate --no-input && \
    python manage.py collectstatic --no-input && \
    python manage.py runserver 0.0.0.0:8000


