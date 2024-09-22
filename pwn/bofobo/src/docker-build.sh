#!/bin/bash

docker build -t bofobo-pwn .

# to run container
# docker run --rm -d -p 9997:8000 bofobo-pwn:latest