require('chai').should()

const ALLOWED_SHIPS = require('../../../src/battleship/config').ALLOWED_SHIPS;
const Player = require('../../../src/battleship/domain/player').Player;
const Ship = require('../../../src/battleship/domain/ship').Ship;
const ShipAlignment = require('../../../src/battleship/domain/ship').ShipAlignment;

describe('Player', () => {

    var player;
    
    beforeEach(() => {
        player = new Player('player1', ALLOWED_SHIPS);
    });

    describe('#placeShip()', () => {
        it('should set all allowed ships', () => {
            placeAllShips(player);
        });

        it('should throw an error when more than 1 carriers is placed', () => {
            player.placeShip('A', 1, new Ship('carrier', 5, 1), ShipAlignment.horizontally);

            var placeSecondCarrier = () => player.placeShip('C', 1, 
                new Ship('carrier', 5, 1), ShipAlignment.horizontally);

            placeSecondCarrier.should.throw('Ship type exhausted');
        });
    })
})

function placeAllShips(player) {
    player.placeShip('A', 1, new Ship('carrier', 5, 1), ShipAlignment.horizontally);
    player.placeShip('A', 3, new Ship('battleship', 4, 2), ShipAlignment.horizontally);
    player.placeShip('A', 5, new Ship('battleship', 4, 2), ShipAlignment.horizontally);
    player.placeShip('A', 7, new Ship('destroyer', 3, 3), ShipAlignment.horizontally);
    player.placeShip('A', 9, new Ship('destroyer', 3, 3), ShipAlignment.horizontally);
    player.placeShip('G', 1, new Ship('destroyer', 3, 3), ShipAlignment.horizontally);
    player.placeShip('G', 3, new Ship('submarine', 2, 4), ShipAlignment.horizontally);
    player.placeShip('G', 5, new Ship('submarine', 2, 4), ShipAlignment.horizontally);
    player.placeShip('G', 7, new Ship('submarine', 2, 4), ShipAlignment.horizontally);
    player.placeShip('G', 9, new Ship('submarine', 2, 4), ShipAlignment.horizontally);
}

module.exports = {
    placeAllShips: placeAllShips
}