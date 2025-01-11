FROM python:3.10

RUN mkdir -p /app

WORKDIR /app

<<<<<<< HEAD
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y build-essential libgl1 libglib2.0-0 \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*
=======
RUN apt-get update 
RUN apt-get install -y build-essential libgl1 libglib2.0-0
RUN apt-get install -y python3-picamera2 
RUN apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false 
RUN rm -rf /var/lib/apt/lists/*
>>>>>>> 9826880 ([Docker] Fix attempt on Docker)

RUN pip3 install --upgrade pip

COPY ./requirements.txt /app/requirements.txt

RUN pip3 install -r requirements.txt
RUN pip3 install django-user-sessions
RUN pip3 install django-cors-headers
RUN pip3 install djangorestframework
RUN pip3 install markdown
RUN pip3 install django-filter
RUN pip3 install opencv-python
RUN pip3 install opencv-contrib-python
RUN pip3 install imutils
RUN pip3 install picamera2

COPY . /app/

COPY ./start /start
RUN sed -i 's/\r$//g' /start
sRUN chmod +x /start

CMD python manage.py migrate --no-input && \
    python manage.py collectstatic --no-input && \
    python manage.py runserver 0.0.0.0:8000


