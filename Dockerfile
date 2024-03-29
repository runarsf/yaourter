FROM node:16.6-alpine

WORKDIR /usr/local/yaourter

COPY package*.json ./
RUN npm install \
 && npm cache clean --force

ENV PATH=/usr/local/yaourter/node_modules/.bin:$PATH

WORKDIR /usr/local/yaourter/app

COPY . .

CMD [ "sh", "-c", "rm -rf /usr/local/yaourter/app/node_modules/* && npm start" ]
