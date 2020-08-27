var { Game } = require('../domain/game');
var { DomainError } = require('../domain/error');

class GameRepository {
    constructor() {
        this.games = new Map();
        this.counter = 0;
    }

    create(player) {
        const game = new Game(player);

        this.games.set(this.counter, game);
        return this.counter++;
    }

    get(gameId) {
        if (!this.games.has(gameId)) {
            throw new DomainError(`No game with id ${gameId} existing`, {});
        }

        return this.games.get(gameId);
    }

    remove(gameId) {
        this.games.delete(gameId);
    }

    list() {
        const result = [];

        for (const gameId of this.games.keys()) {
            const entry = this.games.get(gameId).getState();

            entry['gameId'] = gameId;
            result.push(entry);
        }

        return result;
    }
}

module.exports = {
    GameRepository: GameRepository
}