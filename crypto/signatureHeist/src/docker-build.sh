#!/bin/bash

docker build -t signatureheist-crypto .

# To run the container after it is build 
# docker run --rm -d -p 12001:5000 signheist-crypto:latest