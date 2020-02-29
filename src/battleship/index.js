
const ApplicationService = require('./application/service').ApplicationService;
const RestController = require('./infrastructure/rest_controller').RestController;
const ALLOWED_SHIPS = require('./config').ALLOWED_SHIPS;

var applicationService = new ApplicationService(ALLOWED_SHIPS);
var restController = new RestController(applicationService);

restController.start();