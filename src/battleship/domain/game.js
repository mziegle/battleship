var { Sea } = require('./sea');
var { DomainError } = require('./error');

class Player {
    constructor(name, shipPlacement) {
        this.name = name;
        this.sea = new Sea(shipPlacement.ships);
    }

    fireAt(row, column) {
        return this.sea.fireAt(row, column);
    }

    allShipsSunk() {
        return this.sea.allShipsSunk();
    }
}

class Game {
    constructor(player1) {
        player1.enforceAllShipsPlaced();

        this.players = {};
        this.activePlayer = new Player(player1.name, player1.shipPlacement);
        this.players[player1.name] = this.activePlayer ;
        this.inactivePlayer = undefined;
        this.running = false;
        this.winner = undefined;
    }
    
    join(player2) {
        if (this.bothPlayersPresent()) {
            throw new DomainError(`This game has already two palyers`, {});
        }

        player2.enforceAllShipsPlaced();
        
        this.inactivePlayer = new Player(player2.name, player2.shipPlacement);;
        this.players[player2.name] = this.inactivePlayer;
        this.running = true;
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
        
        var bombardmentResult = this.inactivePlayer.fireAt(row, column);
        
        if (this.inactivePlayer.allShipsSunk()) {
            this.winner = this.activePlayer;
        }

        switch (bombardmentResult) {
            case 'hit':
                break;
    
            case 'water':
            case 'sunk':
                this.switchPlayers();
                break;
        }
        
        return bombardmentResult;
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