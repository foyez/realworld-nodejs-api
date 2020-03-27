FROM node:12.16.1-buster-slim

WORKDIR /usr/src/realwrold-api

COPY ./ ./

RUN yarn

CMD ["/bin/bash"]