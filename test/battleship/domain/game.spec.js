require('chai').should()

const ALLOWED_SHIPS = require('../../../src/battleship/config').ALLOWED_SHIPS;
const Game = require('../../../src/battleship/domain/game').Game;
const Ship = require('../../../src/battleship/domain/ship').Ship;
const Player = require('../../../src/battleship/domain/player').Player;
const ShipAlignment = require('../../../src/battleship/domain/ship').ShipAlignment;
const placeAllShips = require('./player.spec').placeAllShips;

describe('Game', () => {

    var game;
    var player1;
    var player2;

    beforeEach(() => {
        player1 = new Player('player1', ALLOWED_SHIPS);
        player2 = new Player('player2', ALLOWED_SHIPS);
        game = new Game(player1, player2);
    });

    describe('#join()', () => {
        it('TODO', () => {})
    });

    describe('#start()', () => {
        it('should start the game when both players have set all their ships', () => {
            placeAllShips(player1);
            placeAllShips(player2);
    
            game.start();
    
            game.running.should.be.true;
        });

        it('should throw an error when on player has not set all his ships', () => {
            placeAllShips(player1);
    
            var start = () => game.start();
    
            start.should.throw();
        });
    });

    describe('#fire()', () => {
        
        it('should indicate "water" when no ship was hit', () => {
            placeAllShips(player1);
            placeAllShips(player2);
    
            game.start();

            game.fire('A', 10).hits.should.equal('water');
        });

        it('should indicate "hit" when a ship was hit', () => {
            placeAllShips(player1);
            placeAllShips(player2);
    
            game.start();

            game.fire('A', 1).hits.should.equal('hit');
        });

        it('should indicate "sunk" when all fields of the ship have been hit', () => {
            placeAllShips(player1);
            placeAllShips(player2);
    
            game.start();

            game.fire('A', 1).hits.should.equal('hit');
            game.fire('B', 1).hits.should.equal('hit');
            game.fire('C', 1).hits.should.equal('hit');
            game.fire('D', 1).hits.should.equal('hit');
            game.fire('E', 1).hits.should.equal('sunk');
        });
    });

    it('the game is over when all ships of one player are sunk', () => {
        placeAllShips(player1);
        placeAllShips(player2);

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

        game.winner.name.should.equal(player1.name);
    });

    function sinkCarrier() {
        game.fire('A', 1);
        game.fire('B', 1);
        game.fire('C', 1);
        game.fire('D', 1);
        game.fire('E', 1).hits.should.equal('sunk');
    }

    function sinkBattleship1() {
        game.fire('A', 3);
        game.fire('B', 3);
        game.fire('C', 3);
        game.fire('D', 3).hits.should.equal('sunk');
    }

    function sinkBattleship2() {
        game.fire('A', 5);
        game.fire('B', 5);
        game.fire('C', 5);
        game.fire('D', 5).hits.should.equal('sunk');
    }

    function sinkDestroyer1() {
        game.fire('A', 7);
        game.fire('B', 7);
        game.fire('C', 7).hits.should.equal('sunk');
    }

    function sinkDestroyer2() {
        game.fire('A', 9);
        game.fire('B', 9);
        game.fire('C', 9).hits.should.equal('sunk');
    }

    function sinkDestroyer3() {
        game.fire('G', 1);
        game.fire('H', 1);
        game.fire('I', 1).hits.should.equal('sunk');
    }

    function sinkSubmarine1() {
        game.fire('G', 3);
        game.fire('H', 3).hits.should.equal('sunk');
    }

    function sinkSubmarine2() {
        game.fire('G', 5);
        game.fire('H', 5).hits.should.equal('sunk');
    }

    function sinkSubmarine3() {
        game.fire('G', 7);
        game.fire('H', 7).hits.should.equal('sunk');
    }

    function sinkSubmarine4() {
        game.fire('G', 9);
        game.fire('H', 9).hits.should.equal('sunk');
    }
})