const { setWorldConstructor } = require('cucumber')
const Sut = require('../support/sut')

class World {

    constructor() {
        this.sut = new Sut('node', ['src/battleship/index.js']);
    }

    requireSut() {
        return this.sut.start();
    }

    shutdownSut() {
        return this.sut.stop();
    }
}

setWorldConstructor(World)