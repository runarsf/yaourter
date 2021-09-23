FROM node:latest

WORKDIR /app

#COPY package*.json ./
COPY . .

RUN npm install
#&& npm cache clean --force

CMD [ "npm", "start" ]
