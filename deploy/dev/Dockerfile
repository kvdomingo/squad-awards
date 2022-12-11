FROM python:3.10-bullseye as base

ENV DEBIAN_FRONTEND noninteractive
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV POETRY_VERSION 1.2.2

RUN pip install "poetry==$POETRY_VERSION" && poetry config virtualenvs.create false

WORKDIR /tmp

COPY ../../pyproject.toml ../../poetry.lock ./

RUN poetry install --no-ansi --no-interaction

WORKDIR /backend

ENTRYPOINT [ "/backend/deploy/dev/docker-entrypoint.sh" ]
