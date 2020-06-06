
var registerPlayer = function(url, name) {
    return {
        method: 'POST',
        uri: `${url}/players`,
        body: {
            name: name
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    }
}

var placeShip = function(url, gameId, player, row, column, shipType, alignment) {
    return {
        method: 'PUT',
        uri: `${url}/players/${player}/${row}/${column}`,
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

var createGame = function(url, player1, player2) {
    return {
        method: 'POST',
        uri: `${url}/games`,
        body: {
            player1: player1,
            player2: player2
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        resolveWithFullResponse: true
    };
}

var gameStatus = function(url, gameId) {
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
    startGame: startGame,
    gameStatus: gameStatus,
    fire: fire
}