const request = require('request-promise');
const api = require('./api');

const URL = 'http://localhost:8080';
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

const DEFAULT_SHIP_PLACEMENTS = [
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

class BattleshipServer {

    constructor(url=URL, defaultFields=DEFAULT_FIELDS) {
        this.url = url;
        this.defaultFields = defaultFields;
        this.defaultShipPlacements = DEFAULT_SHIP_PLACEMENTS
        this.games = new Map();
    }

    async registerPlayer(name) {
        try {
            return await request(api.registerPlayer(this.url, name)) 
        } catch (statusCodeError) {
            return statusCodeError;
        }
    }

    async checkStatus(gameId) {
        return await request(api.gameStatus(this.url, gameId));
    }

    async createGame(player1, player2) {
        const response =  await request(api.createGame(this.url, player1, player2));
        const gameId = response.body.id;

        this.games.set(gameId, { player1: player1, player2: player2 });
        return response;
    }

    async placeShip(gameId, player, shipType, fieldName, alignment='horizontally') {
        var field = Field.parse(fieldName)

        try {
            return await request(api.placeShip(this.url, gameId, player, field.row, field.column, shipType, alignment));
        } catch (statusCodeError) {
            return statusCodeError;
        }
    }

    async placeNShipsOfType(gameId, player, shipType, count) {
        for (const fieldName of this.defaultFields.slice(0, count)) {
            await this.placeShip(gameId, player, shipType, fieldName);
        }
    }

    async placeAllShips(gameId) {
        const game = this.games.get(gameId);
        const players = [game.player1, game.player2];

        for (const player of players) {
            for (const placement of this.defaultShipPlacements) {
                await this.placeShip(gameId, player, placement.type, placement.head);
            }
        }
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