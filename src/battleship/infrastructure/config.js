const dotenv = require('dotenv');

const ALLOWED_SHIPS = [
    { type: 'carrier', size: 5, count: 1 },
    { type: 'battleship', size: 4, count: 2 },
    { type: 'destroyer', size: 3, count: 3 },
    { type: 'submarine', size: 2, count: 4 },
]

class ServiceConfig {
    constructor() {
        dotenv.config();
        this.values = new Map();

        this.values.set('http.port', process.env.PORT || 8080);
        this.values.set('http.host', process.env.HOST || '0.0.0.0');
        this.values.set('domain.ships', process.env.SHIP_CONFIG || ALLOWED_SHIPS);
        this.values.set('node.env', process.env.NODE_ENV || 'production') 
    }

    getProperty(key) {
        return this.values.get(key);
    }
}

module.exports = {
    ServiceConfig: ServiceConfig
}