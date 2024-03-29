const request = require('request-promise');
const api = require('./api');
const { assert } = require('chai');

const URL = 'http://localhost:8888';
const DEFAULT_FIELDS = ['A1', 'A3', 'A5', 'A7', 'A9'];

class ShipPlacement {
    constructor(head, tail, type) {
        this.head = head;
        this.tail = tail;
        this.type = type;
    }

    getFields() {
        return [this.head].concat(this.tail);
    }
}

const DEFAULT_FLEET = [
    new ShipPlacement('A1', ['B1', 'C1', 'D1', 'E1'], 'carrier'),
    new ShipPlacement('A3', ['B3', 'C3', 'D3'], 'battleship'),
    new ShipPlacement('A5', ['B5', 'C5', 'D5'], 'battleship'),
    new ShipPlacement('A7', ['B7', 'C7'], 'destroyer'),
    new ShipPlacement('A9', ['B9', 'C9'], 'destroyer'),
    new ShipPlacement('G1', ['H1', 'I1'], 'destroyer'),
    new ShipPlacement('G3', ['H3'], 'submarine'),
    new ShipPlacement('G5', ['H5'], 'submarine'),
    new ShipPlacement('G7', ['H7'], 'submarine'),
    new ShipPlacement('G9', ['H9'], 'submarine'),
];

class GameObservable {
    constructor() {
        this.events = [];
        this.observers = [];
    }

    notify(event) {
        this.observers.forEach(observer => observer(event));
        this.events.push(event);
    }

    receive(eventType) {
        return new Promise((resolve) => {
            const event = this.events.find(event => event.type === eventType);

            if (event) {
                resolve(event);
            }

            const observer = (event) => event.type === eventType ? resolve(event) : undefined;
            
            this.observers.push(observer);
        });
    }
}

class BattleshipServer {

    constructor(url=URL, defaultFields=DEFAULT_FIELDS) {
        this.url = url;
        this.socketioClient;
        this.defaultFields = defaultFields;
        this.defaultShipPlacements = DEFAULT_FLEET
        this.games = new Map();
        this.players = [];

        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    }

    async registerPlayer(name) {
        try {
            const result = await request(api.registerPlayer(this.url, name));

            this.players.push(name);
            return result;
        } catch (statusCodeError) {
            return statusCodeError;
        }
    }

    async checkStatus(gameId) {
        return await request(api.gameStatus(this.url, gameId));
    }

    async createGame(player1) {
        const response =  await request(api.createGame(this.url, player1));
        // TODO configure
        this.socketioClient = require('socket.io-client')('http://localhost:8888');
        const gameId = response.body.id;

        var connected = new Promise((resolve, reject) => {
            this.socketioClient.on('connect', () => {
                this.gameObservable = new GameObservable();
                this.socketioClient.emit('subscribe', {'gameId': gameId});
                resolve();
            });
            this.socketioClient.on('game', (event) => {
                this.gameObservable.notify(event);
            });
            this.socketioClient.on('disconnect', () => {
                this.gameObservable = undefined;
                reject('Socketio connection died');
            })
        });

        await connected;
        return response;
    }

    async receive(eventType) {
        assert(this.gameObservable, 'No connection to game!');
        return await this.gameObservable.receive(eventType);
    }

    async getGameState(gameId) {
        const response = await request(api.getGameState(this.url, gameId));

        return response;
    }

    async placeNShipsOfType(player, shipType, count) {
        for (const fieldName of this.defaultFields.slice(0, count)) {
            await this.placeShip(player, shipType, fieldName);
        }
    }
    
    async placeAllShips() {
        assert(this.players.length === 2, 'Exactly two players need to be registered to auto prepare a game');
        for (const player of this.players) {
            await this.placeAllShipsFor(player);
        }
    }
    
    async placeAllShipsFor(player) {
        for (const placement of this.defaultShipPlacements) {
            await this.placeShip(player, placement.type, placement.head);
        }
    }

    async placeShip(player, shipType, fieldName, alignment='horizontally') {
        var field = Field.parse(fieldName)

        try {
            return await request(api.placeShip(this.url, player, field.row, field.column, shipType, alignment));
        } catch (statusCodeError) {
            return statusCodeError;
        }
    }

    async join(gameId, player) {
        return await request(api.join(this.url, gameId, player));
    }

    async startGame(gameId) {
        try {
            return await request(api.startGame(this.url, gameId));
        } catch (statusCodeError) {
            return statusCodeError;
        }
    }

    async fire(gameId, fieldName, victim) {
        var field = Field.parse(fieldName);

        try {
            return await request(api.fire(this.url, gameId, victim, field))
        } catch (statusCodeError) {
            return statusCodeError;
        }
    }

    async sinkAllShips(gameId, victim, attacker) {
        var lastResponse;
        
        const hitWater = async () => this.fire(gameId, 'J10', attacker);

        for (const placement of this.defaultShipPlacements) {
            lastResponse = await this.sinkShip(gameId, victim, placement);
            await hitWater();
        }

        return lastResponse;
    }

    async sinkShip(gameId, victim, placement) {
        var lastResponse;

        for (const field of placement.getFields()) {
            lastResponse = await this.fire(gameId, field, victim);
        }

        return lastResponse;
    }

    anyShipPlacement() {
        return this.defaultShipPlacements[0];
    }

    shutdown() {
        if (this.socketioClient) {
            this.socketioClient.close();
        }
    }
}

class Field {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    static parse(fieldName) {
        var match = fieldName.match(/([A-Z]+)([0-9]+)/);

        return new Field(match[1], match[2])
    }
}

module.exports = {
    BattleshipServer: BattleshipServer
}