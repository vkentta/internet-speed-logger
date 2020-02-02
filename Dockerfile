FROM ubuntu:bionic

ENV SPEEDTEST_INSTALL_KEY 379CE192D401AB61

RUN apt-get update && apt-get install -y gnupg1 apt-transport-https dirmngr ca-certificates curl
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys $SPEEDTEST_INSTALL_KEY
RUN echo "deb https://ookla.bintray.com/debian bionic main" | tee /etc/apt/sources.list.d/speedtest.list
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update && apt-get install -y speedtest nodejs

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]