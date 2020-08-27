
var registerPlayer = function(url, name) {
    return {
        method: 'POST',
        uri: `${url}/players`,
        body: {
            name: name,
            password: 'secret',
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    }
}

var placeShip = function(url, player, row, column, shipType, alignment) {
    return {
        method: 'PUT',
        uri: `${url}/players/${player}/sea/${row}/${column}`,
        body: {
            shipType: shipType,
            alignment: alignment
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };
}

var createGame = function(url, player) {
    return {
        method: 'POST',
        uri: `${url}/games`,
        body: {
            player: player
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };
}

var getGameState = function(url, gameId) {
    return {
        method: 'GET',
        uri: `${url}/games/${gameId}/state`,
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    }
}

var join = function(url, gameId, player) {
    return {
        method: 'PATCH',
        uri: `${url}/games/${gameId}`,
        body: {
            player: player
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    }
}

var startGame = function(url, gameId) {
    return {
        method: 'PUT',
        uri: `${url}/games/${gameId}/state`,
        body: {
            start: true
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    }
}

var fire = function(url, gameId, player, field) {
    return {
        method: 'DELETE',
        uri: `${url}/games/${gameId}/${player}/sea/${field.row}/${field.column}`,
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };
}

module.exports = {
    registerPlayer, registerPlayer,
    placeShip: placeShip,
    createGame: createGame,
    join: join,
    startGame: startGame,
    getGameState: getGameState,
    fire: fire
}