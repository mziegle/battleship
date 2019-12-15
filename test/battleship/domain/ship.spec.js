require('chai').should();
var ships = require('../../../src/battleship/domain/ship');

describe('Ship', () => {

    describe('#Carrier()', () => {
        it('should instantiate a Carrier', () => {
            var carrier = new ships.Carrier();

            carrier.size.should.equal(5);
        })
    });

    describe('#Battleship()', () => {
        it('should instantiate a Battleship', () => {
            var battleship = new ships.Battleship();

            battleship.size.should.equal(4);
        })
    });

    describe('#Destroyer()', () => {
        it('should instantiate a Destroyer', () => {
            var destroyer = new ships.Destroyer();

            destroyer.size.should.equal(3);
        })
    });

    describe('#Submarine()', () => {
        it('should instantiate a Submarine', () => {
            var submarine = new ships.Submarine();

            submarine.size.should.equal(2);
        })
    });

});