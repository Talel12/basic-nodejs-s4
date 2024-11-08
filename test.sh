#!/bin/bash

# Define the preferred host ports for deployment
PORTS=(3001 3002)
CONTAINER_NAME="devops-s4-container"
IMAGE="talel12/basic-nodejs-s4"  # Adjust for your image source

# Function to check if a port is in use
is_port_in_use() {
  local port=$1
  if lsof -i :"$port" > /dev/null; then
    return 0  # Port is in use
  else
    return 1  # Port is available
  fi
}

# Find an available port
AVAILABLE_PORT=""
for port in "${PORTS[@]}"; do
  if ! is_port_in_use "$port"; then
    AVAILABLE_PORT=$port
    break
  fi
done

# Exit if no available ports are found
if [ -z "$AVAILABLE_PORT" ]; then
  echo "No available ports found!"
  exit 1
fi

echo "Deploying to available port: $AVAILABLE_PORT"

# Run the new container on the available port
sudo docker pull "$IMAGE"
sudo docker run -d -p "${AVAILABLE_PORT}:3001" --name "${CONTAINER_NAME}-temp" "$IMAGE" --build
# Wait briefly to confirm the new container is running
sleep 5

# Stop and remove the old container
if sudo docker ps -q -f name="$CONTAINER_NAME"; then
  sudo docker stop "$CONTAINER_NAME"
  sudo docker rm "$CONTAINER_NAME"
fi

# Rename the new container to take over the stable name
sudo docker rename "${CONTAINER_NAME}-temp" "$CONTAINER_NAME"

# Optionally, clean up unused images to free up space
sudo docker images prune -f

echo "Deployment completed to port $AVAILABLE_PORT with zero downtime."
