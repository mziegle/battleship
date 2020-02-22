var should = require('chai').should()
var Game = require('../../../src/battleship/domain/game').Game;
var Sea = require('../../../src/battleship/domain/sea').Sea;
var ShipAlignment = require('../../../src/battleship/domain/ship').ShipAlignment;
var Battleship = require('../../../src/battleship/domain/ship').Battleship;
var Carrier = require('../../../src/battleship/domain/ship').Carrier;
var Destroyer = require('../../../src/battleship/domain/ship').Destroyer;
var Submarine = require('../../../src/battleship/domain/ship').Submarine;

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

            placeSecondCarrier.should.throw('Ship type exhausted');
        });

        it('should throw an error when an unregisted player tries to set a ship', () => {
            var unkownPlayerPlacesShip = () => game.placeShip('unknown', 'A', 1, new Carrier(), ShipAlignment.horizontally);

            unkownPlayerPlacesShip.should.throw('unknown');
        });

        it('should set all allowed ships', () => {
            placeAllShips(PLAYER_1);
        });
    })
    
    describe('#start()', () => {
        it('should start the game when both players have set all their ships', () => {
            placeAllShips(PLAYER_1);
            placeAllShips(PLAYER_2);
    
            game.start();
    
            game.running.should.be.true;
        });

        it('should throw an error when on player has not set all his ships', () => {
            placeAllShips(PLAYER_1);
    
            var start = () => game.start();
    
            start.should.throw();
        });
    });

    describe('#bombard()', () => {
        
        it('should indicate "water" when no ship was hit', () => {
            placeAllShips(PLAYER_1);
            placeAllShips(PLAYER_2);
    
            game.start();

            game.bombard('A', 10).should.equal('water');
        });

        it('should indicate "hit" when a ship was hit', () => {
            placeAllShips(PLAYER_1);
            placeAllShips(PLAYER_2);
    
            game.start();

            game.bombard('A', 1).should.equal('hit');
        });

        it('should indicate "sunk" when all fields of the ship have been hit', () => {
            placeAllShips(PLAYER_1);
            placeAllShips(PLAYER_2);
    
            game.start();

            game.bombard('A', 1).should.equal('hit');
            game.bombard('B', 1).should.equal('hit');
            game.bombard('C', 1).should.equal('hit');
            game.bombard('D', 1).should.equal('hit');
            game.bombard('E', 1).should.equal('sunk');
        });
    });

    it('the game is over when all ships of one player are sunk', () => {
        placeAllShips(PLAYER_1);
        placeAllShips(PLAYER_2);

        game.start();

        sinkCarrier();
        sinkCarrier();

        sinkBattleship1();
        sinkBattleship1();

        sinkBattleship2();
        sinkBattleship2();

        sinkDestroyer1();
        sinkDestroyer1();

        sinkDestroyer2();
        sinkDestroyer2();

        sinkDestroyer3();
        sinkDestroyer3();

        sinkSubmarine1();
        sinkSubmarine1();

        sinkSubmarine2();
        sinkSubmarine2();

        sinkSubmarine3();
        sinkSubmarine3();

        sinkSubmarine4();

        game.winner.name.should.equal(PLAYER_1);
    });

    function sinkCarrier() {
        game.bombard('A', 1);
        game.bombard('B', 1);
        game.bombard('C', 1);
        game.bombard('D', 1);
        game.bombard('E', 1).should.equal('sunk');
    }

    function sinkBattleship1() {
        game.bombard('A', 3);
        game.bombard('B', 3);
        game.bombard('C', 3);
        game.bombard('D', 3).should.equal('sunk');
    }

    function sinkBattleship2() {
        game.bombard('A', 5);
        game.bombard('B', 5);
        game.bombard('C', 5);
        game.bombard('D', 5).should.equal('sunk');
    }

    function sinkDestroyer1() {
        game.bombard('A', 7);
        game.bombard('B', 7);
        game.bombard('C', 7).should.equal('sunk');
    }

    function sinkDestroyer2() {
        game.bombard('A', 9);
        game.bombard('B', 9);
        game.bombard('C', 9).should.equal('sunk');
    }

    function sinkDestroyer3() {
        game.bombard('G', 1);
        game.bombard('H', 1);
        game.bombard('I', 1).should.equal('sunk');
    }

    function sinkSubmarine1() {
        game.bombard('G', 3);
        game.bombard('H', 3).should.equal('sunk');
    }

    function sinkSubmarine2() {
        game.bombard('G', 5);
        game.bombard('H', 5).should.equal('sunk');
    }

    function sinkSubmarine3() {
        game.bombard('G', 7);
        game.bombard('H', 7).should.equal('sunk');
    }

    function sinkSubmarine4() {
        game.bombard('G', 9);
        game.bombard('H', 9).should.equal('sunk');
    }

    function placeAllShips(player) {
        game.placeShip(player, 'A', 1, new Carrier(), ShipAlignment.horizontally);
        game.placeShip(player, 'A', 3, new Battleship(), ShipAlignment.horizontally);
        game.placeShip(player, 'A', 5, new Battleship(), ShipAlignment.horizontally);
        game.placeShip(player, 'A', 7, new Destroyer(), ShipAlignment.horizontally);
        game.placeShip(player, 'A', 9, new Destroyer(), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 1, new Destroyer(), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 3, new Submarine(), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 5, new Submarine(), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 7, new Submarine(), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 9, new Submarine(), ShipAlignment.horizontally);
    }
})