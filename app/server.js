const path = require('path');
const express = require('express');
const chalk = require('chalk');
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
        this.app.use('/public', express.static(path.join(__dirname, '../', 'public')));
    }

    boot() {
        this.app.listen(this.port, () => console.log(chalk.green('MIA application running on port: ' + this.port)));
    }
};