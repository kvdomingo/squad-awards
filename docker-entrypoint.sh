#!/bin/sh

if [ "$PYTHON_ENV" != "development" ]; then
  python manage.py collectstatic --noinput
fi

python manage.py migrate
python manage.py createsuperuser --noinput || true
python manage.py createcachetable

if [ "$PYTHON_ENV" = "development" ]; then
  exec gunicorn --config gunicorn.conf.py --bind 0.0.0.0:5000 --reload
else
  exec gunicorn --config gunicorn.conf.py --bind 0.0.0.0:$PORT
fi
