#!/bin/bash

docker build -t easy-flow-pwn .

# to run container
docker run --rm -d -p 9995:8000 easy-flow-pwn:latest