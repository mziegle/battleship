var { Sea } = require('./sea');
var { DomainError } = require('./error');
const { createField } = require('./field');

class GameCreated {
    constructor(name) {
        this.name = name;
    }
}

class PlayerJoined {
    constructor(name) {
        this.name = name;
    }
}

class WaterHit {
    constructor(target, field) {
        this.target = target;
        this.field = field;
    }
}

class ShipHit {
    constructor(target, field) {
        this.target = target;
        this.field = field;
    }
}

class ShipSunk {
    constructor(target, field) {
        this.target = target;
        this.field = field;
    }
}

class ActivePlayerSwitched {
    constructor(activePlayer, inactivePlayer) {
        this.activePlayer = activePlayer;
        this.inactivePlayer = inactivePlayer;
    }
}

class GameWon {
    constructor(winner) {
        this.winner = winner;
    }
}

class Player {
    constructor(name, fleet) {
        this.name = name;
        this.sea = new Sea(fleet.ships);
    }

    fireAt(row, column) {
        return this.sea.fireAt(row, column);
    }

    allShipsSunk() {
        return this.sea.allShipsSunk();
    }

    getBombedFields() {
        return this.sea.getBombedFields();
    }
}

class Game {
    constructor(player1, eventStream) {
        player1.enforceAllShipsPlaced();

        this.players = {};
        this.activePlayer = new Player(player1.name, player1.fleet);
        this.players[player1.name] = this.activePlayer;
        this.inactivePlayer = undefined;
        this.running = false;
        this.winner = undefined;
        this.eventStream = eventStream;
        this.eventStream.publish(new GameCreated(this.getActivePlayerName()))
    }
    
    join(player2) {
        if (this.bothPlayersPresent()) {
            throw new DomainError(`This game has already two palyers`, {});
        }

        player2.enforceAllShipsPlaced();
        
        this.inactivePlayer = new Player(player2.name, player2.fleet);;
        this.players[player2.name] = this.inactivePlayer;
        this.running = true;
        this.eventStream.publish(new PlayerJoined(player2.name));
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
        if (this.winner) {
            throw new DomainError(`Cannot fire, game is already won by ${this.winner.name}`,
                { winner: this.winner.name });
        }

        if (!this.running) {
            throw new DomainError('The game has not been started yet', {});
        }

        if (this.getInactivePlayerName() !== target) {
            throw new DomainError(`It's not ${this.getInactivePlayerName()}s turn`, {});
        }

        var bombardmentResult = this.inactivePlayer.fireAt(row, column);
        
        if (this.inactivePlayer.allShipsSunk()) {
            this.winner = this.activePlayer;
            this.running = false;
        }

        switch (bombardmentResult) {
            case 'hit':
                this.eventStream.publish(
                    new ShipHit(this.getInactivePlayerName(), createField(column, row).toString()));
                break;
    
            case 'water':
                this.eventStream.publish(
                    new WaterHit(this.getInactivePlayerName(), createField(column, row).toString()));
                this.switchPlayers();
                break;
            case 'sunk':
                this.eventStream.publish(
                    new ShipSunk(this.getInactivePlayerName(), createField(column, row).toString()));
                this.switchPlayers();
                break;
        }

        if (this.winner) {
            this.eventStream.publish(new GameWon(this.winner.name));
        }
        
        return bombardmentResult;
    }

    getBombedFields(playerName) {
        const player = this.players[playerName];

        return player.getBombedFields();
    }

    switchPlayers() {
        var tmp = this.activePlayer;
        this.activePlayer = this.inactivePlayer;
        this.inactivePlayer = tmp;
        this.eventStream.publish(new ActivePlayerSwitched(this.getActivePlayerName(), this.getInactivePlayerName()));
    }
}

module.exports = {
    ActivePlayerSwitched: ActivePlayerSwitched,
    Game: Game,
    GameCreated: GameCreated,
    GameWon: GameWon,
    PlayerJoined: PlayerJoined,
    ShipHit: ShipHit,
    ShipSunk: ShipSunk,
    WaterHit: WaterHit,
}