require('chai').should()

const ApplicationService = require('../../../src/battleship/application/service').ApplicationService;
const DomainError = require('../../../src/battleship/domain/error').DomainError;
const ShipAlignment = require('../../../src/battleship/domain/ship').ShipAlignment;

const SHIP_CONFIG = [
    { type: 'destroyer', size: 3, count: 1 }
]

describe('Service', () => {
    var service;

    beforeEach(() => {
        service = new ApplicationService(SHIP_CONFIG);
    });

    describe('#registerPlayer()', () => {
        it('should add an new player', () => {
            // Arrange
            service.registerPlayer('player1', 'secret');
            
            // Act / Assert
            service.listPlayers().should.include('player1');
        });

        it('should throw an error when player registers with existing name', () => {
            // Arrange
            service.registerPlayer('player1', 'secret');
            
            // Act
            const useNameTwice = () => service.registerPlayer('player1', 'secret');

            // Assert
            useNameTwice.should.throw('player1');
        });
    });

    describe('#getShipConfig()', () => {
        it('should return the ship configuration', () => {
            // Arrange / Act / Assert
            service.getShipConfig().should.eql(SHIP_CONFIG);
        });
    });

    describe('#placeShip()', () => {
        beforeEach(() => {
            // Arrange
            service.registerPlayer('player1');
        });

        it('should place a destroyer', () => {
            // Act
            const fieldsOccupied = service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);

            // Assert
            fieldsOccupied.should.eql(['A1', 'B1', 'C1']);
        });

        it('should not allow to set more ships than configured', () => {
            // Arrange
            service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);

            // Act
            placeOneShipTooMany = () => service.placeShip('player1', 'A', 3, 'destroyer', ShipAlignment.horizontally);

            // Assert
            placeOneShipTooMany.should.throw(DomainError, 'exhausted');
        });
    });

    describe('#getShips()', () => {
        beforeEach(() => {
            // Arrange
            service.registerPlayer('player1');
        });

        it('should get the ships currently set', () => {
            // Arrange
            service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);

            // Act
            const actual = service.getShips('player1');

            // Assert
            const expected = [{type: 'destroyer', fields: ['A1', 'B1', 'C1']}];

            actual.should.eql(expected);
        });
    });

    describe('#createGame()', () => {
        it('should create a new game', () => {
            // Arrange
            service.registerPlayer('player1');
            service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);

            const gameId = service.createGame('player1');

            // Act / Assert
            service.gameState(gameId).should.eql({
                running: false,
                activePlayer: 'player1',
                inactivePlayer: undefined
            });
        });
    });

    describe('#quitGame()', () => {

        beforeEach(() => {
            // Arrange
            service.registerPlayer('player1');
            service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);

            service.registerPlayer('player2');
            service.placeShip('player2', 'A', 1, 'destroyer', ShipAlignment.horizontally);
        });

        it('should quit a game', () => {
            // Arrange
            const gameId = service.createGame('player1');

            // Act
            service.quitGame(gameId);
            
            // Assert
            var getState = () => service.gameState(gameId);

            getState.should.throw(DomainError, String(gameId));
        });

        it('players seas should be reset when they start a new game', () => {
            // Arrange
            var gameId = service.createGame('player1');

            service.join(gameId, 'player2');
            service.fireAt(gameId, 'player2', 'A', 1);

            service.quitGame();

            // Act
            gameId = service.createGame('player1');
            service.join(gameId, 'player2');
            
            // Assert
            service.fireAt(gameId, 'player2', 'A', 1).should.equal('hit');
        });
    });

    describe('#join()', () => {
        it('should start the game when the second player joins', () => {
            // Arrange
            service.registerPlayer('player1');
            service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);
            
            const gameId = service.createGame('player1');

            service.registerPlayer('player2');
            service.placeShip('player2', 'A', 1, 'destroyer', ShipAlignment.horizontally);
            
            // Act
            service.join(gameId, 'player2');
            
            // Assert
            service.gameState(gameId).should.eql({
                running: true,
                activePlayer: 'player1',
                inactivePlayer: 'player2'
            });
        });

        it('should not start game when one player has not set all its ships', () => {
            // Arrange
            service.registerPlayer('player1');
            service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);
            
            const gameId = service.createGame('player1');

            service.registerPlayer('player2');

            // Act 
            var otherPlayerWantsToJoin = () => service.join(gameId, 'player2');

            // Assert
            otherPlayerWantsToJoin.should.throw(DomainError, 'Not all ships were placed');
        });
    });

    describe('#listGames()', () => {
        it('should list the existing games', () => {
            // Arrange
            service.registerPlayer('player1');
            service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);
            service.createGame('player1');

            // Act / Assert
            service.listGames().should.eql([
                {
                    gameId: 0,
                    running: false,
                    activePlayer: 'player1',
                    inactivePlayer: undefined
                }
            ]);
        });
    });

    describe('#fire', () => {
        var gameId;

        beforeEach(() => {
            // Arrange
            service.registerPlayer('player1');
            service.placeShip('player1', 'A', 1, 'destroyer', ShipAlignment.horizontally);
            service.registerPlayer('player2');
            service.placeShip('player2', 'A', 1, 'destroyer', ShipAlignment.horizontally);

            gameId = service.createGame('player1');

            service.join(gameId, 'player2');
        });

        it('should indicate "water" when no ship was hit', () => {
            // Act / Assert
            service.fireAt(gameId, 'player2', 'D', 1).should.equal('water');
        });

        it('should indicate "hit" when a ship was hit', () => {
            // Act / Assert
            service.fireAt(gameId, 'player2', 'C', 1).should.equal('hit');
        });

        it('should indicate "sunk" when all fields of the ship have been hit', () => {
            // Act / Assert
            service.fireAt(gameId, 'player2', 'A', 1).should.equal('hit');
            service.fireAt(gameId, 'player2', 'B', 1).should.equal('hit');
            service.fireAt(gameId, 'player2', 'C', 1).should.equal('sunk');
        });

        it('the game is over when all ships of one player are sunk', () => {
            // Arrange
            service.fireAt(gameId, 'player2', 'A', 1).should.equal('hit');
            service.fireAt(gameId, 'player2', 'B', 1).should.equal('hit');
            
            // Act
            service.fireAt(gameId, 'player2', 'C', 1).should.equal('sunk');

            // Assert
            service.gameState(gameId).should.eql({
                running: true,
                activePlayer: 'player2',
                inactivePlayer: 'player1',
                winner: 'player1'
            });
        });
    });
})