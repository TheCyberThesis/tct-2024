#!/bin/bash

docker build -t rootyrevenge-pwn .

docker run --rm -d -p 9996:8000 rootyrevenge-pwn:latest