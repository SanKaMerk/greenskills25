FROM python:3.11-alpine

WORKDIR /app
COPY ./app/. /app/.

COPY ./requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt