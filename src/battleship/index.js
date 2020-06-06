
const ApplicationService = require('./application/service').ApplicationService;
const PlayerRepository = require('./application/player_repository').PlayerRepository;
const RestController = require('./infrastructure/rest_controller').RestController;
const ALLOWED_SHIPS = require('./config').ALLOWED_SHIPS;

var playerRepository = new PlayerRepository(ALLOWED_SHIPS);
var applicationService = new ApplicationService(ALLOWED_SHIPS, playerRepository);
var restController = new RestController(applicationService);

restController.start();