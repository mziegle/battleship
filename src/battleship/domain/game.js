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
}

Game.prototype.switchPlayers = function() {
    var tmp = this.activePlayer;
    this.activePlayer = this.inactivePlayer;
    this.inactivePlayer = tmp;
}

Game.prototype.placeShip = function(playerName, row, column, ship, alignment) {
    
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

        player.sea.placeShip(row, column, ship, alignment);
    } else {
        throw new Error(`Player ${playerName} is not registered for this game`);
    }
}

Game.prototype.start = function() {
    this.running = true;

    // TODO check whether all ships are set for each player
}

Game.prototype.bombard = function(row, column) {
    if (!this.running) {
        throw new Error(`It is only possible to fire when the game is running`);
    }

    var bombardmentResult = this.inactivePlayer.sea.bombard(row, column);

    switch (bombardmentResult) {
        case 'Hit':
            console.log(`Ship at (${row},${column}) was hit`);
            break;

        case 'Water':
            console.log(`Bomb fell in the water at (${row},${column})`);
            this.switchPlayers();
            break;

        case 'Sunk':
            console.log(`Ship at (${row},${column}) was sunk`);
            this.switchPlayers();
            break;
    }
}

module.exports = {
    Game: Game
}