
var placeShip = function(url, gameId, player, row, column, shipType, alignment) {
    return {
        method: 'PUT',
        uri: `${url}/games/${gameId}/${player}/sea/${row}/${column}`,
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
    placeShip: placeShip,
    createGame: createGame,
    startGame: startGame,
    fire: fire
}