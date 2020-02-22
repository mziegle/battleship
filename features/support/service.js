const request = require('request-promise');
const api = require('./api');

const URL = 'http://localhost:8080';
const DEFAULT_FIELDS = ['A1', 'A3', 'A5', 'A7', 'A9'];
const DEFAULT_SHIP_PLACEMENT = [
    ['A1', 'carrier'],
    ['A3', 'battleship'],
    ['A5', 'battleship'],
    ['A7', 'destroyer'],
    ['A9', 'destroyer'],
    ['G1', 'destroyer'],
    ['G3', 'submarine'],
    ['G5', 'submarine'],
    ['G7', 'submarine'],
    ['G9', 'submarine']
];

const SHIPS = [
    new ShipPlacement('A1', ['B1', 'C1', 'D1', 'E1']),
    new ShipPlacement('A3', ['B3', 'C3', 'D3']),
    new ShipPlacement('A1', ['B1', 'C1', 'D1', 'E1']),
    new ShipPlacement('A1', ['B1', 'C1', 'D1', 'E1']),
];
// TODO save fields on placeShips

class ShipPlacement {
    constructor(head, tail, type) {
        this.head = head;
        this.tail = tail;
        this.type = type;
    }
}

class BattleshipServer {

    constructor(url=URL, defaultFields=DEFAULT_FIELDS, defaultShipPlacement=DEFAULT_SHIP_PLACEMENT) {
        this.url = url;
        this.defaultFields = defaultFields;
        this.defaultShipPlacement = new Map(defaultShipPlacement)
        this.games = new Map();
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

    async placeAllShips(gameId, shipPlacement=this.defaultShipPlacement) {
        const game = this.games.get(gameId);
        const players = [game.player1, game.player2];

        for (const player of players) {
            for (const [fieldName, shipType] of shipPlacement) {
                await this.placeShip(gameId, player, shipType, fieldName);
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