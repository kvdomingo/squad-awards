FROM node:16-alpine as build

WORKDIR /tmp

COPY ../../web/static/web/ ./

RUN yarn install && yarn build

FROM python:3.10-bullseye as base

ENV DEBIAN_FRONTEND noninteractive
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV POETRY_VERSION 1.2.2

RUN pip install "poetry==$POETRY_VERSION" && poetry config virtualenvs.create false

WORKDIR /tmp

COPY ../../pyproject.toml ../../poetry.lock ./

RUN poetry export -f requirements.txt --without-hashes | pip install -r /dev/stdin

WORKDIR /backend

COPY ../../api/ ./api/
COPY ../../squad_awards/ ./squad_awards/
COPY ../../web/*.py ./web/
COPY --from=build /tmp/dist/ ../web/static/web/
COPY ./docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

EXPOSE $PORT

ENTRYPOINT [ "/backend/docker-entrypoint.sh" ]
