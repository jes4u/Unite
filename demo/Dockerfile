# Python support can be specified down to the minor or micro version
# (e.g. 3.6 or 3.6.3).
# OS Support also exists for jessie & stretch (slim and full).
# See https://hub.docker.com/r/library/python/ for all supported Python
# tags from Docker Hub.
FROM tiangolo/uwsgi-nginx:python3.7-alpine3.7

# If you prefer miniconda:
#FROM continuumio/miniconda3

LABEL Name=demo Version=0.0.1
ENV LISTEN_PORT=8000
EXPOSE 8000

# Indicate where uwsgi.ini lives
ENV UWSGI_INI uwsgi.ini

# Tell nginx where static files live (as typically collected using Django's
# collectstatic command.
# ENV STATIC_URL /webpages/static_collected

# Make app folder writable for the sake of db.sqlite3, and make that file also writable.
RUN chmod g+w /webpages
RUN chmod g+w /webpages/db.sqlite3



WORKDIR /app
ADD . /app

# Using pip:
RUN python3 -m pip install -r requirements.txt
# CMD ["python3", "-m", "demo"]

# Using pipenv:
#RUN python3 -m pip install pipenv
#RUN pipenv install --ignore-pipfile
#CMD ["pipenv", "run", "python3", "-m", "demo"]

# Using miniconda (make sure to replace 'myenv' w/ your environment name):
#RUN conda env create -f environment.yml
#CMD /bin/bash -c "source activate myenv && python3 -m demo"
