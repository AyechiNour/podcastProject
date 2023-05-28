FROM node:16

WORKDIR /usr/src/docker-react-sample

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3007
CMD ["npm", "run", "dev"]