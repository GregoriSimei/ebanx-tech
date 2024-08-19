FROM node:22-slim

RUN apt update && apt install -y openssl procps

RUN yarn

WORKDIR /home/node/app

USER node

CMD tail -f /dev/null