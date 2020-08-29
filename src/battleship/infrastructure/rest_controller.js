
var cors = require('cors')
const pino = require('pino');
const HttpStatus = require('http-status-codes');
const expressPino = require('express-pino-logger');
const express = require('express');
const { request, response } = require('express');

const logger = pino({level: process.env.LOG_LEVEL || 'info', prettyPrint: { colorize: true, translateTime: 'SYS:standard' }});
const expressLogger = expressPino({ logger, useLevel: 'trace' });

const DomainError = require('../domain/error').DomainError;
const ShipAlignment = require('../domain/ship').ShipAlignment;

class RestController {
    
    constructor(serviceConfig, applicationService) {
        this.serviceConfig = serviceConfig;
        this.applicationService = applicationService;
        this.httpServer = express();
        
        this.httpServer.use(expressLogger);
        this.httpServer.use(express.json());

        // TODO only for site development
        this.httpServer.use(cors());

        this.httpServer.get('/config', (request, response) => this.getConfig(request, response));
        this.httpServer.post('/login', (request, response) => this.login(request, response));
        this.httpServer.post('/players', (request, response) => this.registerPlayer(request, response));
        this.httpServer.put('/players/:name/sea/:x/:y', (request, response) => this.placeShip(request, response));
        this.httpServer.get('/players/:name/sea/ships', (request, response) => this.getShips(request, response));
        this.httpServer.delete('/players/:name/sea/ships', (request, response) => this.removeShips(request, response));
        this.httpServer.get('/games', (request, response) => this.listGames(request, response));
        this.httpServer.post('/games', (request, response) => this.createGameFor(request, response));
        this.httpServer.delete('/games/:id', (request, response) => this.quitGame(request, response));
        this.httpServer.patch('/games/:id', (request, response) => this.join(request, response));
        this.httpServer.get('/games/:id/state', (request, response) => this.getGameState(request, response));
        this.httpServer.delete('/games/:gameId/:player/sea/:row/:column', (request, response) => this.fireAt(request, response));
        this.httpServer.get('/games/:gameId/:player/sea', (request, response) => this.getBombedFields(request, response));
    }
    
    start() {
        const port = this.serviceConfig.getProperty('http.port');

        this.httpServer.listen(port, () => {
            console.log("Battleship server has been started"); // Need this for test
            logger.info('Battleship server running on port %d', port);
        });
    }

    getConfig(_, response) {
        const size = 10;
        const ships = this.serviceConfig.getProperty('domain.ships');
        const body = JSON.stringify({
            size: size,
            ships: ships,
        });
        
        logger.info('getConfig(): %s', body);
        
        response.statusCode = HttpStatus.OK;
        response.write(body);
        response.end();
    }

    registerPlayer(request, response) {
        var name = request.body.name;
        var password = request.body.password;
        
        if (!name) {
            this.sendParseError(response, 'Name of player is required');
            return;
        }
        if (!password) {
            this.sendParseError(response, 'Password is required');
            return;
        }

        try {
            this.applicationService.registerPlayer(name, password);
            logger.info('registerPlayer(%s, %s)', name, password);
        } catch (error) {
            logger.info('registerPlayer(%s, %s) -> error', name, password, error);
            this.sendApplicationError(response, error);
            return;
        }

        response.statusCode = HttpStatus.CREATED;
        response.setHeader('Location', `/players/${name}`);
        response.end();
    }

    login(request, response) {
        var name = request.body.name;
        var password = request.body.password;
        
        if (!name) {
            this.sendParseError(response, 'Name of player is required');
            return;
        }
        if (!password) {
            this.sendParseError(response, 'Password is required');
            return;
        }

        try {
            this.applicationService.login(name, password);
            logger.info('login(%s, %s)', name, password);
        } catch (error) {
            logger.info('login(%s, %s) -> error', name, password, error);
            this.sendApplicationError(response, error);
            return;
        }

        response.statusCode = HttpStatus.OK;
        response.end();
    }

    listGames(_, response) {
        const result = this.applicationService.listGames();

        response.statusCode = HttpStatus.OK;
        response.write(JSON.stringify(result));
        response.end();
    }

    createGameFor(request, response) {
        var player = request.body.player;

        if (!player) {
            this.sendParseError(response, 'Player is required');
            return;
        }
        
        var gameId;
        
        try {
            gameId = this.applicationService.createGame(player);
            logger.info('createGameFor(%s): %s', player, gameId);
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

    quitGame(request, response) {
        var gameId = parseInt(request.params.id);

        try {
            this.applicationService.quitGame(gameId);
            logger.info('quitGame(%s)', gameId);
        } catch (error) {
            logger.info('quitGame(%s) -> %s', gameId, error);
            this.sendApplicationError(response, error);
            return;
        }
    
        response.statusCode = HttpStatus.OK;
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
            this.applicationService.join(gameId, player);
            logger.info('join(%s, %s)', gameId, player);
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
        var fields;

        if (!alignment) {
            this.sendParseError(response, 'Cannot find ship alignment');
            return;
        }

        try {
            fields = this.applicationService.placeShip(player, x, y, shipType, alignment);
            logger.info('placeShip(%s, %s, %s, %s, %s): %s', player, x, y, shipType, alignment, fields);
        } catch (error) {
            logger.info('placeShip(%s, %s, %s, %s, %s) -> %s', player, x, y, shipType, alignment, error);
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

    getShips(request, response) {
        var player = request.params.name;
        var ships;

        try {
            ships = this.applicationService.getShips(player);
            logger.info('getShips(%s): %s', player, JSON.stringify(ships));
        } catch (error) {
            logger.info('getShips(%s) -> %s', player, error);
            this.sendApplicationError(response, error);
            return;
        }

        response.statusCode = HttpStatus.OK;
        response.write(JSON.stringify(ships));
        response.end();
    }

    removeShips(request, response) {
        var player = request.params.name;

        try {
            this.applicationService.removeShips(player);
            logger.info('removeShips(%s)', player);
        } catch (error) {
            logger.info('removeShips(%s) -> %s', player, error);
            this.sendApplicationError(response, error);
            return;
        }
        
        response.statusCode = HttpStatus.OK;
        response.end();
    }

    fireAt(request, response) {
        const gameId = parseInt(request.params.gameId);
        const player = request.params.player;
        const row = request.params.row;
        const column = request.params.column;
        var fireResult;

        try {
            fireResult = this.applicationService.fireAt(gameId, player, row, column);
            logger.info('fireAt(%s, %s, %s, %s): %s', gameId, player, row, column, fireResult);
        } catch (error) {
            this.sendApplicationError(response, error);
            logger.info('fireAt(%s, %s, %s, %s) -> %s', gameId, player, row, column, error);
            return;
        }
        
        response.statusCode = HttpStatus.OK;
        response.write(JSON.stringify({
            result: fireResult
        }));
        response.end();
    }

    getBombedFields(request, response) {
        const gameId = parseInt(request.params.gameId);
        const player = request.params.player;

        var result;

        try {
            result = this.applicationService.getBombedFields(gameId, player);
            logger.info('getBombedFields(%s, %s): %s', gameId, player, result);
        } catch (error) {
            this.sendApplicationError(response, error);
            logger.info('getBombedFields(%s, %s) -> %s', gameId, player, error);
            return;
        }
        
        response.statusCode = HttpStatus.OK;
        response.write(JSON.stringify(result));
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