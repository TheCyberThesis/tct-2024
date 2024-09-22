#!/bin/bash

docker build -t fileconfusion-web .

# To run the container after it is build 
# docker run --rm -d -p 31001:5000 fileconfusion-web:latest
