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
            service.registerPlayer('player1');
            
            // Act / Assert
            service.listPlayers().should.include('player1');
        });

        it('should throw an error when player registers with existing name', () => {
            // Arrange
            service.registerPlayer('player1');
            
            // Act
            const useNameTwice = () => service.registerPlayer('player1');

            // Assert
            useNameTwice.should.throw('player1');
        });
    });

    describe('#createGame()', () => {
        it('should create a new game', () => {
            // Arrange
            service.registerPlayer('player1');

            const gameId = service.createGame('player1');

            // Act / Assert
            service.gameState(gameId).should.eql({
                running: false,
                activePlayer: 'player1',
                inactivePlayer: undefined
            });
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
        it('should create a new game', () => {
            // Arrange
            service.registerPlayer('player1');
            service.createGame('player1');
            service.createGame('player1')

            // Act / Assert
            service.listGames().should.eql([
                {
                    gameId: 0,
                    running: false,
                    activePlayer: 'player1',
                    inactivePlayer: undefined
                }, 
                {
                    gameId: 1,
                    running: false,
                    activePlayer: 'player1',
                    inactivePlayer: undefined
                }
            ]);
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
            service.fireAt(gameId, 'player2', 'D', 1).hits.should.equal('water');
        });

        it('should indicate "hit" when a ship was hit', () => {
            // Act / Assert
            service.fireAt(gameId, 'player2', 'C', 1).hits.should.equal('hit');
        });

        it('should indicate "sunk" when all fields of the ship have been hit', () => {
            // Act / Assert
            service.fireAt(gameId, 'player2', 'A', 1).hits.should.equal('hit');
            service.fireAt(gameId, 'player2', 'B', 1).hits.should.equal('hit');
            service.fireAt(gameId, 'player2', 'C', 1).hits.should.equal('sunk');
        });

        it('the game is over when all ships of one player are sunk', () => {
            // Arrange
            service.fireAt(gameId, 'player2', 'A', 1).hits.should.equal('hit');
            service.fireAt(gameId, 'player2', 'B', 1).hits.should.equal('hit');
            
            // Act
            service.fireAt(gameId, 'player2', 'C', 1).hits.should.equal('sunk');

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