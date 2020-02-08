var Sea = require('./sea').Sea;
var shipConfigs = require('./ship').shipConfigs;

class Player {
    constructor(name, sea) {
        this.name = name;
        this.sea = sea;
    }
}

class StateError extends Error {
    constructor(message, details) {
        super(message);

        this.name = 'State Error';
        this.details = details;
    }
}

class Game {

    constructor(namePlayer1, namePlayer2) {
        this.players = {};
        this.players[namePlayer1] = new Player(namePlayer1, new Sea());
        this.players[namePlayer2] = new Player(namePlayer2, new Sea());
        this.activePlayer = this.players[namePlayer1];
        this.inactivePlayer = this.players[namePlayer2];
        this.running = false;
        this.winner = undefined;
    }

    getInactivePlayerName() {
        return this.inactivePlayer.name;
    }

    switchPlayers() {
        var tmp = this.activePlayer;
        this.activePlayer = this.inactivePlayer;
        this.inactivePlayer = tmp;
    }

    placeShip(playerName, row, column, ship, alignment) {
        var fields = [];
    
        if (this.running) {
            throw new Error(`The ${ship} cannot be placed, because the game is already running`);
        }
    
        var player = this.players[playerName];
        
        if (player) {
            var countShipsPlaced = player.sea.shipsByType(ship.type).length;
    
            if (countShipsPlaced >= ship.count)
            {
                throw new Error(`The ${ship.type} cannot be placed, because only ${ship.count} ships of this type are allowed`);
            }
    
            fields = player.sea.placeShip(row, column, ship, alignment);
        } else {
            throw new Error(`Player ${playerName} is not registered for this game`);
        }
    
        return fields;
    }

    start() {

        if (this.winner) {
            throw new Error(`The game is over, winner is ${this.winner.name}`);
        }
    
        if (this.running) {
            throw new Error(`The game is already running`);
        }

        this.enforceAllShipsPlaced();
    
        this.running = true;
    }

    enforceAllShipsPlaced() {
        var details;

        [this.activePlayer, this.inactivePlayer].forEach(player => {
            
            var shiptsLeftToBePlaced = this.findShipsLeftToBePlaced(player); 
            
            if (shiptsLeftToBePlaced) {
                if (!details) {
                    details = {};
                }

                details[player.name] = shiptsLeftToBePlaced;
            }
        });

        if (details) {
            throw new StateError('Not all ships were placed', details);
        }
    }

    findShipsLeftToBePlaced(player) {
        var result;
        
        shipConfigs.forEach(shipConfig => {
            const countShipsPlaced = shipConfig.count - player.sea.shipsByType(shipConfig.type).length;
    
            if (countShipsPlaced > 0) {
                if (!result) {
                    result = {};
                }
                result[shipConfig.type] = countShipsPlaced;
            }
        });

        return result;
    }

    bombard(row, column) {

        if (!this.running) {
            throw new StateError('The game has not been started yet', {});
        }
    
        if (this.winner) {
            throw new Error(`Cannot bombard, game is already won by ${this.winner.name}`);
        }
    
        var bombardmentResult = this.inactivePlayer.sea.bombard(row, column);
    
        if (this.inactivePlayer.sea.allShipsSunk()) {
            this.winner = this.activePlayer;
        }
    
        switch (bombardmentResult) {
            case 'Hit':
                break;
    
            case 'Water':
            case 'Sunk':
                this.switchPlayers();
                break;
        }
    
        return bombardmentResult;
    }
}

module.exports = {
    Game: Game,
    StateError: StateError
}