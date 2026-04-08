FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
# change back to "node", "server.js" for production and "npm", "run", "dev" for development with hot-reloading
CMD ["npm", "run", "dev"] 