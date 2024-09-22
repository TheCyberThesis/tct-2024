FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y python3.6 python3-pip poppler-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./app /app

RUN python3 -m pip install -r requirements.txt 

RUN rm /app/requirements.txt

ENV FLASK_APP=app
ENV FLASK_ENV=development

EXPOSE 5000

RUN useradd -u 1000 -d /home/tct-player/ -m -s /bin/bash tct-player && \
    echo "tct-player:guess_p@55_4_m3_24r2cbgD" | chpasswd && \
    chown -R tct-player:tct-player /app

USER tct-player

CMD ["flask", "run", "--host", "0.0.0.0"]