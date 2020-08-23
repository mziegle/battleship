
const express = require('express');
const HttpStatus = require('http-status-codes');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const logger = pino({level: process.env.LOG_LEVEL || 'info', prettyPrint: { colorize: true, translateTime: 'SYS:standard' }});
const expressLogger = expressPino({ logger });

const DomainError = require('../domain/error').DomainError;
const ShipAlignment = require('../domain/ship').ShipAlignment;

class RestController {
    
    constructor(serviceConfig, applicationService) {
        this.serviceConfig = serviceConfig;
        this.applicationService = applicationService;
        this.httpServer = express();
        
        this.allowCrossOriginRequests();
        this.httpServer.use(expressLogger);
        this.httpServer.use(express.json());

        // user management
        this.httpServer.post('/players', (request, response) => this.registerPlayer(request, response));
        this.httpServer.put('/players/:name/:x/:y', (request, response) => this.placeShip(request, response));

        // game management
        this.httpServer.get('/games', (request, response) => this.listGames(request, response));
        this.httpServer.post('/games', (request, response) => this.createGameFor(request, response));
        this.httpServer.patch('/games/:id', (request, response) => this.join(request, response));
        this.httpServer.get('/games/:id/state', (request, response) => this.getGameState(request, response));
        this.httpServer.delete('/games/:gameId/:player/sea/:row/:column', (request, response) => this.fireAt(request, response));
    }
    
    allowCrossOriginRequests() {
        this.httpServer.use(function(_, response, next) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.header("Access-Control-Allow-Headers", "*");
            response.header("Access-Control-Allow-Methods", "*");
            next();
        });
    }
    
    start() {
        const port = this.serviceConfig.getProperty('http.port');

        this.httpServer.listen(port, () => {
            console.log("Battleship server has been started"); // Need this for test
            logger.info('Battleship server running on port %d', port);
        });
    }

    registerPlayer(request, response) {
        
        var name = request.body.name;
        
        if (!name) {
            this.sendParseError('Name of player is required');
        }
        
        try {
            logger.info('registerPlayer(%s)', name);
            this.applicationService.registerPlayer(name);
        } catch (error) {
            this.sendApplicationError(response, error);
            return;
        }

        response.statusCode = HttpStatus.CREATED;
        response.setHeader('Location', `/players/${name}`);
        response.end();
    }

    listGames(_, response) {
        const result = this.applicationService.listGames();

        response.statusCode = HttpStatus.OK;
        response.write(JSON.stringify(result));
        response.end();
    }

    createGameFor(request, response) {
        var player = request.body.player1;

        if (!player) {
            this.sendParseError(response, 'Player is required');
            return;
        }
        
        var gameId;
        
        try {
            logger.info('createGameFor(%s)', player);
            gameId = this.applicationService.createGame(player);
        } catch (error) {
            logger.error('createGameFor(%s) -> %s', player, error);
            this.sendApplicationError(response, error);
            return;
        }
    
        response.setHeader('Location', `/games/${gameId}`);
        response.statusCode = HttpStatus.CREATED;
        response.write(JSON.stringify({
            id: gameId
        }));
        response.end();
    }

    join(request, response) {
        var gameId = parseInt(request.params.id);
        var player = request.body.player;

        if (!player) {
            this.sendParseError(response, 'Player is required');
            return;
        }

        try {
            logger.info('join(%s, %s)', gameId, player);
            this.applicationService.join(gameId, player);
        } catch (error) {
            logger.info('join(%s, %s) -> %s', gameId, player, error);
            this.sendApplicationError(response, error);
            return;
        }
    
        response.statusCode = HttpStatus.NO_CONTENT;
        response.end();
    }

    getGameState(request, response) {
        var gameId = parseInt(request.params.id);
        var state = undefined;

        try {
            state = this.applicationService.gameState(gameId);

            logger.info('getGameState(%s): %s', gameId, JSON.stringify(state));
        } catch (error) {
            logger.info('getGameState(%s) -> %s', gameId, error);
            this.sendApplicationError(response, error);
            return;
        }
    
        response.statusCode = HttpStatus.OK;
        response.write(JSON.stringify(state));
        response.end();
    }

    placeShip(request, response) {
        var player = request.params.name;
        var x = request.params.x;
        var y = request.params.y;
        var shipType = request.body.shipType;

        if (!shipType) {
            this.sendParseError(response, 'Cannot find ship type');
            return;
        }

        var alignment = this.parseShipAlignment(request.body.alignment);

        if (!alignment) {
            this.sendParseError(response, 'Cannot find ship alignment');
            return;
        }
        
        var fields;

        try {
            logger.info('placeShip(%s, %s, %s, %s, %s)', player, x, y, shipType, alignment);
            fields = this.applicationService.placeShip(player, x, y, shipType, alignment);
        } catch (error) {
            logger.warn('placeShip(%s, %s, %s, %s, %s) -> %s', player, x, y, shipType, alignment, error);
            this.sendApplicationError(response, error);
            return;
        }

        response.statusCode = HttpStatus.OK;
        response.write(JSON.stringify({
            fields: fields
        }));
        response.end();
    }

    parseShipAlignment(shipAlignment) {
        var result;

        switch (shipAlignment) {
            case 'horizontally':
            case 'horizontal':
                result = ShipAlignment.horizontally;
                break;
            case 'vertically':
            case 'vertical':
                result = ShipAlignment.vertically;
                break;        
            default:
                // TODO Error
                break;
        }

        return result;
    }

    fireAt(request, response) {
        const gameId = parseInt(request.params.gameId);
        const player = request.params.player;
        const row = request.params.row;
        const column = request.params.column;
        var fireResult;

        try {
            fireResult = this.applicationService.fireAt(gameId, player, row, column);
        } catch (error) {
            this.sendApplicationError(response, error);
            return;
        }
        
        response.statusCode = HttpStatus.OK;
        response.write(JSON.stringify({
            result: fireResult
        }));
        response.end();
    }

    sendParseError(response, message) {
        response.statusCode = HttpStatus.BAD_REQUEST;
        response.write(message);
        response.end();
    }

    sendApplicationError(response, error) {
        if (error instanceof DomainError) {
            var result = {};
            
            response.statusCode = HttpStatus.BAD_REQUEST;
            result['type'] = error.name,
            result['message'] = error.message,
            result['details'] = error.details

            response.write(JSON.stringify(result));
            response.end();
        } else {
            throw error;
        }
    }
}

module.exports = {
    RestController: RestController
}