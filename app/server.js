var express = require('express');
var BotController = require('./controllers/bot.controller');
var HomeController = require('./controllers/home.controller');

/**
 * HTTP server
 */
module.exports = class Server {

    constructor() {
        this.app = express();
        this.registerConfigurations();
        this.registerControllers();
    }

    get port() {
        return process.env.PORT || 3000;
    }

    registerControllers() {
        this.app.use(BotController.baseUrl, new BotController().router);
        this.app.use(HomeController.baseUrl, new HomeController().router);
    }

    registerConfigurations() {

    }

    boot() {
        this.app.listen(this.port, () => console.log('application running on port: ' + this.port));
    }
};