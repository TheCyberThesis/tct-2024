#!/bin/bash
docker build -t starter-web .

docker run -d -p 31000:80 --name starter-web-container starter-web:latest