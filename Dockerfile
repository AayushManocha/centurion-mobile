# Use the official image as a parent image
FROM node:14.17.0

# Set the working directory
WORKDIR /usr/src/app

# Copy the file from your host to your current location
COPY package.json .

# Run the command inside your image filesystem
RUN npm install

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 8100 
CMD ["npm", "run", "dev"]
