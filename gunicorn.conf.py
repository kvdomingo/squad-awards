wsgi_app = "squad_awards.wsgi"

worker_class = "gevent"

pidfile = "/tmp/gunicorn.pid"

errorlog = "-"
accesslog = "-"
loglevel = "debug"
capture_output = True
