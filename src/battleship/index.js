const ApplicationService = require('./application/service').ApplicationService;
const RestController = require('./infrastructure/rest_controller').RestController;
const ServiceConfig = require('./infrastructure/config').ServiceConfig;

var serviceConfig = new ServiceConfig();
var applicationService = new ApplicationService(serviceConfig.getProperty('domain.ships'));
var restController = new RestController(serviceConfig, applicationService);

restController.start();