var Sea = require('./sea').Sea;

function Player(name, sea) {
    this.name = name
    this.sea = sea;
}

function Game(namePlayer1, namePlayer2) {
    this.players = {};
    this.players[namePlayer1] = new Player(namePlayer1, new Sea());
    this.players[namePlayer2] = new Player(namePlayer2, new Sea());
    this.activePlayer = this.players[namePlayer1];
    this.inactivePlayer = this.players[namePlayer2];
    this.running = false;
    this.winner = undefined;
}

Game.prototype.switchPlayers = function() {
    var tmp = this.activePlayer;
    this.activePlayer = this.inactivePlayer;
    this.inactivePlayer = tmp;
}

Game.prototype.placeShip = function(playerName, row, column, ship, alignment) {
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

Game.prototype.start = function() {

    if (this.winner) {
        throw new Error(`The game is over, winner is ${this.winner.name}`);
    }

    if (this.running) {
        throw new Error(`The game is already running`);
    }

    [this.activePlayer, this.inactivePlayer].forEach(player => {
        var countCarriers = player.sea.shipsByType('Carrier').length;
        var countBattleships = player.sea.shipsByType('Battleship').length;
        var countDestroyers = player.sea.shipsByType('Destroyer').length;
        var countSubmarines = player.sea.shipsByType('Submarine').length;
    
        if (countCarriers != 1) {
            throw new Error(`${player.name} needs to place 1 Carrier in order to start the game`);
        }
    
        if (countBattleships != 2) {
            throw new Error(`${player.name} needs to place 2 Battleships in order to start the game`);
        }
    
        if (countDestroyers != 3) {
            throw new Error(`${player.name} needs to place 3 Destoryers in order to start the game`);
        }
    
        if (countSubmarines != 4) {
            throw new Error(`${player.name} needs to place 4 Submarines in order to start the game`);
        }
    });

    this.running = true;
}

Game.prototype.bombard = function(row, column) {

    if (!this.running) {
        throw new Error(`It is only possible to fire when the game is running`);
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

module.exports = {
    Game: Game
}