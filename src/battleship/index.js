var setTestDefaults = function(service) {
    const ShipAlignment = require('./domain/ship').ShipAlignment;

    for (user of ['m', 'a']) {
        service.registerPlayer(user, user);
    
        service.placeShip(user, 'A', 1, 'carrier', ShipAlignment.horizontally);
        service.placeShip(user, 'A', 3, 'battleship', ShipAlignment.horizontally);
        service.placeShip(user, 'A', 5, 'battleship', ShipAlignment.horizontally);
        service.placeShip(user, 'A', 7, 'destroyer', ShipAlignment.horizontally);
        service.placeShip(user, 'A', 9, 'destroyer', ShipAlignment.horizontally);
        service.placeShip(user, 'G', 1, 'destroyer', ShipAlignment.horizontally);
        service.placeShip(user, 'G', 3, 'submarine', ShipAlignment.horizontally);
        service.placeShip(user, 'G', 5, 'submarine', ShipAlignment.horizontally);
        service.placeShip(user, 'G', 7, 'submarine', ShipAlignment.horizontally);
        service.placeShip(user, 'G', 9, 'submarine', ShipAlignment.horizontally);
    }
} 

const ApplicationService = require('./application/service').ApplicationService;
const RestController = require('./infrastructure/rest_controller').RestController;
const ServiceConfig = require('./infrastructure/config').ServiceConfig;

var serviceConfig = new ServiceConfig();
var applicationService = new ApplicationService(serviceConfig.getProperty('domain.ships'));
var restController = new RestController(serviceConfig, applicationService);

// TODO only for local testing
setTestDefaults(applicationService);

restController.start();
