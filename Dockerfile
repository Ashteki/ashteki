FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN apt-get update && apt-get install -y libpango1.0-dev
RUN npm install
COPY . /usr/src/app
EXPOSE 49153
