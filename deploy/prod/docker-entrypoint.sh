#!/bin/sh
python /backend/manage.py collectstatic --noinput
python /backend/manage.py migrate
python /backend/manage.py createsuperuser --noinput || true
exec gunicorn --config /backend/gunicorn.conf.py --bind 0.0.0.0:$PORT
