
var ApplicationService = require('./application/service').ApplicationService;
var RestController = require('./infrastructure/rest_controller').RestController;

var applicationService = new ApplicationService();
var restController = new RestController(applicationService);

restController.start();