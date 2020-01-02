var should = require('chai').should()
var Game = require('../../../src/battleship/domain/game').Game;
var Sea = require('../../../src/battleship/domain/sea').Sea;
var ShipAlignment = require('../../../src/battleship/domain/sea').ShipAlignment;
var Battleship = require('../../../src/battleship/domain/ship').Battleship;
var Carrier = require('../../../src/battleship/domain/ship').Carrier;

const PLAYER_1 = 'player1';
const PLAYER_2 = 'player2';

describe('Game', () => {

    var game;

    beforeEach(() => {
        game = new Game(PLAYER_1, PLAYER_2);
    });

    describe('#placeShip()', () => {
        it('should throw an error when more than 1 carriers is placed', () => {
            game.placeShip(PLAYER_1, 'A', 1, new Carrier(), ShipAlignment.horizontally);

            var placeSecondCarrier = () => game.placeShip(PLAYER_1, 'C', 1, new Carrier(), ShipAlignment.horizontally); 

            placeSecondCarrier.should.throw('Carrier');
        });

        it('should throw an error when a unregisted player tries to set a ship', () => {
            var unkownPlayerPlacesShip = () => game.placeShip('unknown', 'A', 1, new Carrier(), ShipAlignment.horizontally);

            unkownPlayerPlacesShip.should.throw('unknown');
        });
    })
})