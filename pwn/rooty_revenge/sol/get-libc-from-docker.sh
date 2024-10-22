#!/bin/bash

# Define variables
DOCKER_IMAGE_NAME="my_pwn_challenge"
DOCKER_CONTAINER_NAME="pwn_challenge_container"
LIBC_FILE="libc.so.6"
DOCKERFILE_PATH="Dockerfile"

# Step 1: Ensure flag.txt exists
if [ ! -f "flag.txt" ]; then
    echo "Error: flag.txt not found in the build context."
    exit 1
fi

# Step 2: Build the Docker Image directly from the Dockerfile
docker build -t $DOCKER_IMAGE_NAME -f $DOCKERFILE_PATH .

# Step 3: Remove any existing container with the same name
if [ "$(docker ps -a -q -f name=$DOCKER_CONTAINER_NAME)" ]; then
    docker rm -f $DOCKER_CONTAINER_NAME
fi

# Step 4: Run the Docker Container
docker run -d --name $DOCKER_CONTAINER_NAME $DOCKER_IMAGE_NAME

# Step 5: Check which libc is being used inside the container
LIBC_PATH=$(docker exec $DOCKER_CONTAINER_NAME ldd /bin/bash | grep $LIBC_FILE | awk '{print $3}')

if [ -z "$LIBC_PATH" ]; then
    echo "libc not found!"
    docker stop $DOCKER_CONTAINER_NAME
    docker rm $DOCKER_CONTAINER_NAME
    docker rmi $DOCKER_IMAGE_NAME
    exit 1
fi

# Step 6: Download the libc file from the container to the host
docker cp $DOCKER_CONTAINER_NAME:$LIBC_PATH .

# Step 7: Stop and remove the Docker Container
docker stop $DOCKER_CONTAINER_NAME
docker rm $DOCKER_CONTAINER_NAME

# Step 8: Remove the Docker Image
docker rmi $DOCKER_IMAGE_NAME

echo "libc downloaded successfully: $(basename $LIBC_PATH)"
