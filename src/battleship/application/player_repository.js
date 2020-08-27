var Player = require('../domain/player').Player;
var DomainError = require('../domain/error').DomainError;

class PlayerRepository {
    constructor(allowedShips) {
        this.players = new Map();
        this.allowedShips = allowedShips;
    }

    add(name, password) {
        if (this.players.has(name)) {
            throw new DomainError(`The name ${name} is already used`, {});
        }

        const player = new Player(name, password, this.allowedShips);

        this.players.set(name, player);
    }

    get(name) {
        if (!this.players.has(name)) {
            throw new DomainError(`Player ${name} is not registered`, {});
        }

        return this.players.get(name);
    }

    list() {
        return [...this.players.keys()];
    }
}

module.exports = {
    PlayerRepository: PlayerRepository
}