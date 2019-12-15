var should = require('chai').should()
var Sea = require('../../../src/battleship/domain/sea').Sea;
var ShipAlignment = require('../../../src/battleship/domain/sea').ShipAlignment;
var Battleship = require('../../../src/battleship/domain/ship').Battleship;

describe('Sea', () => {
    var sea;

    beforeEach(() => {
        sea = new Sea();
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
            placeShip = (x, y) => sea.placeShip(x, y, new Battleship(), ShipAlignment.horizontally)
            placeShipToQ55 = () => placeShip('Q', 55)
            placeShipToANeg1 = () => placeShip('A', -1)
            placeShipToDollar1 = () => placeShip('$', 1)

            placeShipToQ55.should.throw('(Q, 55)');
            placeShipToANeg1.should.throw('(A, -1)');
            placeShipToDollar1.should.throw('($, 1)');
        })
    });

});