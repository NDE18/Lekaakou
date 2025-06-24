FROM node:18
RUN mkdir -p /usr/src/lekaakou
WORKDIR /usr/src/lekaakou
COPY . .
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]