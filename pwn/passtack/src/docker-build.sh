#!/bin/bash

# To build container
docker build -t passtack-pwn .

# To run the container after it is build 
docker run --rm -d -p 9998:8000 passtack-pwn:latest