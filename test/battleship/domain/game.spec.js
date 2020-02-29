require('chai').should()

const ALLOWED_SHIPS = require('../../../src/battleship/config').ALLOWED_SHIPS;
const Game = require('../../../src/battleship/domain/game').Game;
const Ship = require('../../../src/battleship/domain/ship').Ship;
const ShipAlignment = require('../../../src/battleship/domain/ship').ShipAlignment;

const PLAYER_1 = 'player1';
const PLAYER_2 = 'player2';

describe('Game', () => {

    var game;
    
    beforeEach(() => {
        game = new Game(PLAYER_1, PLAYER_2, ALLOWED_SHIPS);
    });

    describe('#placeShip()', () => {
        it('should throw an error when more than 1 carriers is placed', () => {
            game.placeShip(PLAYER_1, 'A', 1, new Ship('carrier', 5, 1), ShipAlignment.horizontally);

            var placeSecondCarrier = () => game.placeShip(PLAYER_1, 'C', 1, 
                new Ship('carrier', 5, 1), ShipAlignment.horizontally); 

            placeSecondCarrier.should.throw('Ship type exhausted');
        });

        it('should throw an error when an unregistered player tries to set a ship', () => {
            var unknownPlayerPlacesShip = () => game.placeShip('unknown', 'A', 1, 
                new Ship('carrier', 5, 1), ShipAlignment.horizontally);

            unknownPlayerPlacesShip.should.throw('unknown');
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

            game.bombard('A', 10).hits.should.equal('water');
        });

        it('should indicate "hit" when a ship was hit', () => {
            placeAllShips(PLAYER_1);
            placeAllShips(PLAYER_2);
    
            game.start();

            game.bombard('A', 1).hits.should.equal('hit');
        });

        it('should indicate "sunk" when all fields of the ship have been hit', () => {
            placeAllShips(PLAYER_1);
            placeAllShips(PLAYER_2);
    
            game.start();

            game.bombard('A', 1).hits.should.equal('hit');
            game.bombard('B', 1).hits.should.equal('hit');
            game.bombard('C', 1).hits.should.equal('hit');
            game.bombard('D', 1).hits.should.equal('hit');
            game.bombard('E', 1).hits.should.equal('sunk');
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
        game.bombard('E', 1).hits.should.equal('sunk');
    }

    function sinkBattleship1() {
        game.bombard('A', 3);
        game.bombard('B', 3);
        game.bombard('C', 3);
        game.bombard('D', 3).hits.should.equal('sunk');
    }

    function sinkBattleship2() {
        game.bombard('A', 5);
        game.bombard('B', 5);
        game.bombard('C', 5);
        game.bombard('D', 5).hits.should.equal('sunk');
    }

    function sinkDestroyer1() {
        game.bombard('A', 7);
        game.bombard('B', 7);
        game.bombard('C', 7).hits.should.equal('sunk');
    }

    function sinkDestroyer2() {
        game.bombard('A', 9);
        game.bombard('B', 9);
        game.bombard('C', 9).hits.should.equal('sunk');
    }

    function sinkDestroyer3() {
        game.bombard('G', 1);
        game.bombard('H', 1);
        game.bombard('I', 1).hits.should.equal('sunk');
    }

    function sinkSubmarine1() {
        game.bombard('G', 3);
        game.bombard('H', 3).hits.should.equal('sunk');
    }

    function sinkSubmarine2() {
        game.bombard('G', 5);
        game.bombard('H', 5).hits.should.equal('sunk');
    }

    function sinkSubmarine3() {
        game.bombard('G', 7);
        game.bombard('H', 7).hits.should.equal('sunk');
    }

    function sinkSubmarine4() {
        game.bombard('G', 9);
        game.bombard('H', 9).hits.should.equal('sunk');
    }

    function placeAllShips(player) {
        game.placeShip(player, 'A', 1, new Ship('carrier', 5, 1), ShipAlignment.horizontally);
        game.placeShip(player, 'A', 3, new Ship('battleship', 4, 2), ShipAlignment.horizontally);
        game.placeShip(player, 'A', 5, new Ship('battleship', 4, 2), ShipAlignment.horizontally);
        game.placeShip(player, 'A', 7, new Ship('destroyer', 3, 3), ShipAlignment.horizontally);
        game.placeShip(player, 'A', 9, new Ship('destroyer', 3, 3), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 1, new Ship('destroyer', 3, 3), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 3, new Ship('submarine', 2, 4), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 5, new Ship('submarine', 2, 4), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 7, new Ship('submarine', 2, 4), ShipAlignment.horizontally);
        game.placeShip(player, 'G', 9, new Ship('submarine', 2, 4), ShipAlignment.horizontally);
    }
})