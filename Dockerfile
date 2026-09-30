FROM fedora:latest

RUN dnf -y install nodejs npm && \
    dnf clean all

WORKDIR /antora
RUN npm install -g gulp-cli
ADD package*.json .
RUN npm install

ADD . /antora
ENTRYPOINT ["gulp"]
