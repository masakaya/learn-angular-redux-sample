FROM node:20

# Install essential tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install git curl wget

# Install global npm packages
RUN npm install -g @angular/cli

# Set working directory
WORKDIR /workspace

# The remoteUser is set to root in devcontainer.json
