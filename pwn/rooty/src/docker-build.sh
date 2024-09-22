#!/bin/bash

# To build container
docker build -t rooty-pwn .

# To run the container after it is build 
# docker run --rm -d -p 9999:8000 rooty-pwn:latest
