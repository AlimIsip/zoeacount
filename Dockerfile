FROM ubuntu:latest
LABEL authors="Client"

ENTRYPOINT ["top", "-b"]