FROM python:alpine3.7

MAINTAINER Ralph Tapac "rdtapac@gmail.com"

ADD GoogleMapTest /code
WORKDIR /code

RUN pip3.7 install -r requirements.txt

EXPOSE 5000

CMD python run.py

#ENTRYPOINT ["python"]
#CMD ["run.py"]
