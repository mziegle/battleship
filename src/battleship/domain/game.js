var Sea = require('./sea').Sea;
var DomainError = require('./error').DomainError;
var Player = require('./player').Player;

class Game {
    constructor(player1) {
        this.players = {};
        this.activePlayer = player1;
        this.inactivePlayer = undefined;
        this.players[player1.name] = player1;
        this.running = false;
        this.winner = undefined;
    }
    
    join(player2) {
        this.inactivePlayer = player2;
        this.players[player2.name] = player2;
    }

    getState() {
        var result = {
            running: this.running,
            activePlayer: this.getActivePlayerName(),
            inactivePlayer: this.getInactivePlayerName()
        }

        if (this.winner) {
            result.winner = this.winner.name;
        }

        return result;
    }

    getActivePlayerName() {
        if (!this.activePlayer) {
            return undefined;
        }
        return this.activePlayer.name;
    }

    getInactivePlayerName() {
        if (!this.inactivePlayer) {
            return undefined;
        }
        return this.inactivePlayer.name;
    }

    start() {
        if (!this.bothPlayersPresent()) {
            throw new DomainError(`Second player is missing`, {});
        }
        if (this.running) {
            throw new DomainError(`The game is already running`, {});
        }
        if (this.winner) {
            throw new DomainError(`The game is over, winner is ${this.winner.name}`, { 
                winner: this.winner.name });
        }
        this.activePlayer.enforceAllShipsPlaced();
        this.inactivePlayer.enforceAllShipsPlaced();
        this.running = true;
    }

    bothPlayersPresent() {
        return this.activePlayer && this.inactivePlayer;
    }

    fireAt(target, row, column) {
        
        if (this.getInactivePlayerName() !== target) {
            throw new DomainError(`It's not ${this.getInactivePlayerName()}s turn`, {});
        }

        if (!this.running) {
            throw new DomainError('The game has not been started yet', {});
        }
    
        if (this.winner) {
            throw new DomainError(`Cannot fire, game is already won by ${this.winner.name}`,
                { winner: this.winner.name });
        }
        
        var result = {};
        var bombardmentResult = this.inactivePlayer.sea.fire(row, column);
        
        if (this.inactivePlayer.sea.allShipsSunk()) {
            this.winner = this.activePlayer;
            result.winner = this.winner.name;
        }

        switch (bombardmentResult) {
            case 'hit':
                break;
    
            case 'water':
            case 'sunk':
                this.switchPlayers();
                break;
        }
    
        result.hits = bombardmentResult;

        return result;
    }

    switchPlayers() {
        var tmp = this.activePlayer;
        this.activePlayer = this.inactivePlayer;
        this.inactivePlayer = tmp;
    }
}

module.exports = {
    Game: Game
}