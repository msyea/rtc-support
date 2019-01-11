FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --no-optional

COPY . /usr/src/app

EXPOSE 8000
CMD [ "npm", "start" ]