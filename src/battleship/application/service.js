const { PlayerRepository } = require('./player_repository');
const { GameRepository } = require('./game_repository');
const { DomainError } = require('../domain/error');

class ApplicationService {
    constructor(shipConfigs) {
        this.shipConfigs = shipConfigs;
        this.playerRepository = new PlayerRepository(shipConfigs);
        this.gameRepository = new GameRepository();
    }

    registerPlayer(playerName, password) {
        this.playerRepository.add(playerName, password);
    }

    login(playerName, password) {
        const player = this.playerRepository.get(playerName);
        
        if (player.password !== password) {
            throw new DomainError(`Password for player ${playerName} is wrong`);
        }
    }

    listPlayers() {
        return this.playerRepository.list();
    }

    placeShip(playerName, x, y, shipType, shipAlignment) {
        var player = this.playerRepository.get(playerName);
        var fields = player.placeShip(x, y, shipType, shipAlignment);

        return fields;
    }

    removeShip(playerName, x, y) {
        // TODO
    }

    getShips(playerName) {
        var player = this.playerRepository.get(playerName);

        return player.getShips();
    }

    removeShips(playerName) {
        var player = this.playerRepository.get(playerName);

        return player.removeShips();
    }

    createGame(playerName) {
        const player = this.playerRepository.get(playerName);
        const gameId = this.gameRepository.create(player);

        return gameId;
    }

    quitGame(gameId) {
        this.gameRepository.remove(gameId);
    }

    listGames() {
        return this.gameRepository.list();
    }

    gameState(gameId) {
        return this.gameRepository.get(gameId).getState();
    }

    join(gameId, playerName) {
        const player = this.playerRepository.get(playerName);
        const game = this.gameRepository.get(gameId);

        game.join(player);
    }

    fireAt(gameId, target, row, column) {
        var game = this.gameRepository.get(gameId);

        return game.fireAt(target, row, column);
    }

    getBombedFields(gameId, playerName) {
        var game = this.gameRepository.get(gameId);

        return game.getBombedFields(playerName);
    }
}

module.exports = {
    ApplicationService: ApplicationService
}