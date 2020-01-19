var should = require('chai').should()
var Sea = require('../../../src/battleship/domain/sea').Sea;
var ShipAlignment = require('../../../src/battleship/domain/sea').ShipAlignment;
var Battleship = require('../../../src/battleship/domain/ship').Battleship;

describe('Sea', () => {
    var sea;
    var placeShipHorizontally;

    beforeEach(() => {
        sea = new Sea();
        placeShipHorizontally = (x, y) => sea.placeShip(x, y, new Battleship(), ShipAlignment.horizontally)
        placeShipVertically = (x, y) => sea.placeShip(x, y, new Battleship(), ShipAlignment.vertically)
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
            var placeShipToQ55 = () => placeShipHorizontally('Q', 55)
            var placeShipToANeg1 = () => placeShipHorizontally('A', -1)
            var placeShipToDollar1 = () => placeShipHorizontally('$', 1)

            placeShipToQ55.should.throw('Q55');
            placeShipToANeg1.should.throw('A-1');
            placeShipToDollar1.should.throw('$1');
        })

        it('should throw an error when one ships is placed onto an other', () => {
            var placeShipToA1 = () => placeShipHorizontally('A', 1);
            var placeShipToD1 = () => placeShipHorizontally('D', 1);

            placeShipToA1();
            placeShipToA1.should.throw('A1');
            placeShipToD1.should.throw('D1');
        });

        it('should throw an error when one ship is placed directly below an other', () => {
            var placeShipToA2 = () => placeShipHorizontally('A', 2);
            
            placeShipHorizontally('A', 1);
            placeShipToA2.should.throw('A1');
        });

        it('should throw an error when one ship is placed directly above an other', () => {
            var placeShipToA1 = () => placeShipHorizontally('A', 1);
            
            placeShipHorizontally('A', 2);
            placeShipToA1.should.throw('A2');
        });

        it('should throw an error when one ship is placed directly to the left of an other', () => {
            var placeShipToE1 = () => placeShipVertically('E', 1);
            
            placeShipHorizontally('A', 1);
            placeShipToE1.should.throw('D1');
        });

        it('should throw an error when one ship is placed directly to the right of an other', () => {
            var placeShipToB2 = () => placeShipVertically('B', 2);
            
            placeShipVertically('A', 1);
            placeShipToB2.should.throw('A2');
        });

        it('should throw an error when one ship is placed directly to the top left of an other', () => {
            var placeShipToA1 = () => placeShipHorizontally('A', 1);
            
            placeShipVertically('E', 2);
            placeShipToA1.should.throw('E2');
        });

        it('should throw an error when one ship is placed directly to the top right of an other', () => {
            var placeShipToA2 = () => placeShipVertically('A', 2);
            
            placeShipHorizontally('B', 1);
            placeShipToA2.should.throw('B1');
        });

        it('should throw an error when one ship is placed directly to the bottom left of an other', () => {
            var placeShipToB1 = () => placeShipHorizontally('B', 1);
            
            placeShipVertically('A', 2);
            placeShipToB1.should.throw('A2');
        });

        it('should throw an error when one ship is placed directly to the bottom right of an other', () => {
            var placeShipToE2 = () => placeShipHorizontally('E', 2);
            
            placeShipHorizontally('A', 1);
            placeShipToE2.should.throw('D1');
        });
    });

});