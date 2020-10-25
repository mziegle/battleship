FROM node:12

WORKDIR /home/node/app
COPY ./ui/dist dist
COPY ./server/src src
COPY ./server/package*.json ./
RUN npm install
EXPOSE 8888
CMD [ "node", "src/battleship/index.js" ]
