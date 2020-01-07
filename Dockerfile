FROM node:12.13.1-alpine

EXPOSE 8080

WORKDIR /var/app

COPY package.json /var/app/
COPY package-lock.json /var/app/
COPY start.sh /var/app/

COPY init.sql /docker-entrypoint-initdb.d/

RUN npm install

COPY . /var/app

CMD ./start.sh