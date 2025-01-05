FROM node:23-bullseye as node

WORKDIR /app

COPY package*.json ./

RUN npm install concurrently
RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]