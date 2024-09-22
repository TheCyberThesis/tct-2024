#!/bin/bash

docker build -t bb-crypto .

# To run the container after it is build 
# docker run --rm -d -p 12002:5000 bb-crypto:latest