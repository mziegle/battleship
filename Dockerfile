FROM node:12

WORKDIR /home/node/app

COPY ./server/src src
COPY ./server/package*.json ./
RUN npm install

COPY ./ui/dist dist

EXPOSE 8888
CMD [ "node", "src/battleship/index.js" ]
