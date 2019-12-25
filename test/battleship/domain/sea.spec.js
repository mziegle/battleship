var should = require('chai').should()
var Sea = require('../../../src/battleship/domain/sea').Sea;
var ShipAlignment = require('../../../src/battleship/domain/sea').ShipAlignment;
var Battleship = require('../../../src/battleship/domain/ship').Battleship;

describe('Sea', () => {
    var sea;
    var placeShip;

    beforeEach(() => {
        sea = new Sea();
        placeShip = (x, y) => sea.placeShip(x, y, new Battleship(), ShipAlignment.horizontally)
    });

    describe('#Sea()', () => {
        it('should instantiate a sea', () => {
            should.exist(sea);
            sea.should.be.an('object');
        })
    });

    describe('#isHit()', () => {
        it('should determine whether a shot at this field would be a hit', () => {
            sea.isHit('A', 1).should.be.false;
        })
    })

    describe('#placeShip()', () => {
        it('should place a ship horizontally', () => {
            sea.placeShip('A', 1, new Battleship(), ShipAlignment.horizontally);

            sea.isHit('A', 1).should.be.true;
            sea.isHit('B', 1).should.be.true;
            sea.isHit('C', 1).should.be.true;
            sea.isHit('D', 1).should.be.true;
        })

        it('should place a ship vertically', () => {
            sea.placeShip('A', 1, new Battleship(), ShipAlignment.vertically);

            sea.isHit('A', 1).should.be.true;
            sea.isHit('A', 2).should.be.true;
            sea.isHit('A', 3).should.be.true;
            sea.isHit('A', 4).should.be.true;
        })

        it('should not allow to place a ship outside the sea', () => {
            placeShipToQ55 = () => placeShip('Q', 55)
            placeShipToANeg1 = () => placeShip('A', -1)
            placeShipToDollar1 = () => placeShip('$', 1)

            placeShipToQ55.should.throw('(Q, 55)');
            placeShipToANeg1.should.throw('(A, -1)');
            placeShipToDollar1.should.throw('($, 1)');
        })

        it('should throw an error when one ships is placed onto an other', () => {
            placeShipToA1 = () => placeShip('A', 1);
            placeShipToD1 = () => placeShip('D', 1);

            placeShipToA1();
            placeShipToA1.should.throw('(A, 1)');
            placeShipToD1.should.throw('(D, 1)');
        });

        it('should throw an error when two ships are placed next to each other', () => {

        });
    });

});