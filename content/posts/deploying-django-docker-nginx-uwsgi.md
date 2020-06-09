---
title: "Deploying Django Docker Nginx Uwsgi"
date: 2020-06-09T03:01:59-04:00
draft: true
categories: ['sysadmin', 'python', 'django', 'nginx', 'docker']
---

# Deploying Django project using NGINX, Docker and UWSGI

I maintain an old website for a client which was originally developed in 2015. It hasn't been updated for the last 5 years and uses Django 1.7 and some Django extensions which haven't been updated for Django 3. I recently decided to move the website to a new server and had to repackage the Django code in a Docker container. It took me some time to get it working correctly so I hope this article can save some time for those who might be in the same boat.

Here's what we will be doing:

- Package the Django app in a Docker container along with UWSGI
- Run NGINX on the server and set up reverse proxy for the Docker container

## Why Dockerize the app?

On the old server I didn't have any other Python projects that I was working on. This made it easy to keep an older Python version running. However, on the new server I was already working on some other projects and I did not want to pollute my global `bin` folder with an old Python version. Moreover, I wanted to make sure that if I ever have to move a server again, I don't want to install required Python version myself. This made it pretty obvious that Docker was the way to go.

Another question I asked myself was why not put NGINX in Docker as well? I had another app running on the new server in a Docker container and I had already setup NGINX for that. Proxying requests from an NGINX instance running on host server to an NGINX instance running in a container didn't sound right. I still went ahead and tried to set it up but I couldn't get it to work. I spent a whole day trying to figure this out but then I gave up and decided to only containerize UWSGI and Django and proxy requests to UWSGI via the NGINX instance running on host machine.

## Putting Django in a Container

In the old server setup, the whole request cycle looked like this:

```
the web client <-> NGINX <-> socket <-> uwsgi <-> Django
```

Django sits behind a UWSGI server which runs 4 workers. UWSGI creates a socket which is used to communicate with NGINX. NGINX acts as a reverse proxy and passes all new requests down to UWSGI through the socket. All of this was running on the host server.

In the new setup the whole cycle looked exactly the same with just one minor difference. UWSGI and Django will be running in a container and UWSGI will create a socket file in a volume shared with the host.

The contents of the default `wsgi.py` file created by Django were:

```python
"""
WSGI config for ______ project.
It exposes the WSGI callable as a module-level variable named ``application``.
For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fci_django.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

In addition to that I had a separate `uwsgi.ini` file:

```config
[uwsgi]
project = fci_django
base = /app
socket_dir = /shared

chdir = %(base)
module = %(project).wsgi:application

master = true
processes = 5

socket = %(socket_dir)/%(project).sock
chmod-socket = 666
vacuum = true
```


On the old server I was running UWSGI like this:

```
uwsgi --ini ~/app/uwsgi.ini
```

