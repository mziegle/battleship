require('chai').should()

const {When, Given, Then} = require('cucumber');

const placeShip = async function(player, shipType, fieldName, alignment) {
    this.response = await this.battleshipServer.placeShip(player, shipType, fieldName, alignment);
}

const placeShipHorizontally = async function(player, shipType, fieldName) {
    this.response = await this.battleshipServer.placeShip(player, shipType, fieldName, 'horizontally');
}

const placeShipSomewhere = async function(player, shipType) {
    this.response = await this.battleshipServer.placeShip(player, shipType, 'E10', 'horizontally');
}

const placeNShipsOfType = async function(player, count, shipType) {
    await this.battleshipServer.placeNShipsOfType(player, shipType, count);
}

const placeShips = async function(table) {
    var shipPlacement = new Map();

    for (row of table.rows()) {
        shipPlacement.set(row[0], row[2]);
    }

    await this.battleshipServer.placeAllShips(this.gameId, shipPlacement);
}

const placeAllShips = async function() {
    await this.battleshipServer.placeAllShips(this.gameId);
}

const fire = async function(attacker, fieldName, victim) {
    this.response = await this.battleshipServer.fire(this.gameId, fieldName, victim);
}

const volley = async function(attacker, victim, table) {
    for (row of table.rows()) {
        await this.battleshipServer.fire(this.gameId, row[0], victim);
    }
}

const hitWater = async function(attacker) {
    this.response = await this.battleshipServer.fire(this.gameId, 'J10', 'player2');
    this.response.body.result.should.equal('water');
}

const hitShip = async function(attacker) {
    this.response = await this.battleshipServer.fire(this.gameId, 'A1', 'player2');
    this.response.body.result.should.equal('hit');
}

const sinkShip = async function(attacker) {
    this.response = await this.battleshipServer.sinkShip(this.gameId, 
        'player2', this.battleshipServer.anyShipPlacement());
    this.response.body.result.should.equal('sunk');
}

const sinkAllShips = async function(attacker, victim) {
    this.response = await this.battleshipServer.sinkAllShips(this.gameId, victim, attacker);
}

const checkShipNotSet = function() {
    this.response.statusCode.should.equal(400);
}

const checkShipOccupiesFields = async function(begin, end) {
    var fields = this.response.body.fields;
    
    fields[0].should.equal(begin);
    fields[fields.length - 1].should.equal(end);
}

const checkFireResult = async function(result) {
    this.response.statusCode.should.equal(200);
    this.response.body.result.should.equal(result);
}

Given('both players have placed their ships as follows', placeShips)
Given('{word} has placed a {word} to {word}', placeShipHorizontally);
Given('{word} has placed {int} {word}', placeNShipsOfType);
Given('{word} has fired at the following areas of {word}s sea', volley)

When('{word} sunk the last ship of {word}', sinkAllShips)
When('{word} sinks a ship', sinkShip)
When('{word} places a {word}', placeShipSomewhere);
When('{word} places a {word} to {word}', placeShipHorizontally);
When('{word} places a {word} to {word} {word}', placeShip);
When('{word} hits water', hitWater);
When('{word} hits a ship', hitShip);
When('{word} fires at {word} of {word}s sea', fire)

Then('the ship occupies the fields {word} to {word}', checkShipOccupiesFields);
Then('the ship is not set', checkShipNotSet);
Then('the ship is {word}', checkFireResult);
Then('only {word} is hit', checkFireResult);