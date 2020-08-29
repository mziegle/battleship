var should = require('chai').should()

var ShipAlignment = require('../../../src/battleship/domain/ship').ShipAlignment;
var { Fleet } = require('../../../src/battleship/domain/fleet');

const SHIP_CONFIGS = [
    { type: 'destroyer', size: 3, count: 1 },
    { type: 'submarine', size: 2, count: 2 }
]

describe('Sea', () => {
    var fleet;
    var placeShipHorizontally;
    var placeShipVertically

    beforeEach(() => {
        fleet = new Fleet(SHIP_CONFIGS);
        placeShipHorizontally = (x, y) => fleet.placeShip(x, y, 'submarine', ShipAlignment.horizontally);
        placeShipVertically = (x, y) => fleet.placeShip(x, y, 'submarine', ShipAlignment.vertically);
    });

    describe('#placeShip()', () => {
        it('should place a ship horizontally', () => {
            // Assert / Act / Arrange
            fleet.placeShip('A', 1, 'destroyer', ShipAlignment.horizontally).should.eql(['A1', 'B1', 'C1']);
        })

        it('should place a ship vertically', () => {
            // Assert / Act / Arrange
            fleet.placeShip('A', 1, 'destroyer', ShipAlignment.vertically).should.eql(['A1', 'A2', 'A3']);
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
            var placeShipToD1 = () => placeShipHorizontally('B', 1);
            
            placeShipToA1();
            placeShipToA1.should.throw('A1');
            placeShipToD1.should.throw('B1');
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
            var placeShipToE1 = () => placeShipVertically('C', 1);
            
            placeShipHorizontally('A', 1);
            placeShipToE1.should.throw('B1');
        });
        
        it('should throw an error when one ship is placed directly to the right of an other', () => {
            var placeShipToB2 = () => placeShipVertically('B', 2);
            
            placeShipVertically('A', 1);
            placeShipToB2.should.throw('A2');
        });
        
        it('should throw an error when one ship is placed directly to the top left of an other', () => {
            var placeShipToA1 = () => placeShipHorizontally('A', 1);
            
            placeShipVertically('C', 2);
            placeShipToA1.should.throw('C2');
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
            var placeShipToE2 = () => placeShipHorizontally('B', 2);
            
            placeShipHorizontally('A', 1);
            placeShipToE2.should.throw('B1');
        });
    });
});