FROM navikey/raspbian-bullseye:latest


RUN apt-get update && apt-get -y upgrade
RUN apt-get update && apt-get install -y python3 python3-pip python3-dev build-essential
RUN apt-get install -y python3-picamera2 --no-install-recommends 
RUN apt-get update \
    && apt-get install -y build-essential libgl1 libglib2.0-0 \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/cache/apt/archives/* \
    && rm -rf /var/lib/apt/lists/*


RUN mkdir -p /app

WORKDIR /app


# RUN pip3 install --upgrade pip


COPY ./requirements.txt /app/requirements.txt

RUN pip3 install --no-cache-dir -r requirements.txt
RUN pip3 install django-user-sessions
RUN pip3 install django-cors-headers
RUN pip3 install djangorestframework
RUN pip3 install markdown
RUN pip3 install django-filter

COPY . /app/

CMD python3 manage.py migrate --no-input && \
    python3 manage.py collectstatic --no-input && \
    python3 manage.py runserver 0.0.0.0:8000


