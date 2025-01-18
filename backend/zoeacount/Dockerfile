FROM debian:bookworm

RUN apt-get update && apt-get -y upgrade
RUN apt install -y --no-install-recommends gnupg

RUN echo "deb http://archive.raspberrypi.org/debian/ bookworm main" > /etc/apt/sources.list.d/raspi.list \
  && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 82B129927FA3303E


RUN apt-get update && apt-get install -y python3 python3-pip python3-dev build-essential  
RUN apt-get install -y python3-picamera2 python3-opencv --no-install-recommends 
RUN apt-get update \
    && apt-get install -y build-essential libgl1 libglib2.0-0 \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && apt-get clean \
    && apt-get autoremove \
    && rm -rf /var/cache/apt/archives/* \
    && rm -rf /var/lib/apt/lists/*


RUN mkdir -p /app

WORKDIR /app


# RUN pip3 install --upgrade pip


COPY ./requirements.txt /app/requirements.txt

RUN pip3 install --break-system-packages --no-cache-dir -r requirements.txt
RUN pip3 install --break-system-packages django-user-sessions
RUN pip3 install --break-system-packages django-cors-headers
RUN pip3 install --break-system-packages djangorestframework
RUN pip3 install --break-system-packages markdown
RUN pip3 install --break-system-packages django-filter


COPY . /app/

CMD python3 manage.py migrate --no-input && \
    python3 manage.py collectstatic --no-input && \
    python3 manage.py runserver 0.0.0.0:8000


