var express = require('express');
var HomeController = require('./controllers/home.controller');
var BotController = require('./controllers/bot.controller');

/**
 * 
 */
module.exports = class Server {

    constructor() {
        this.app = express();
        this.registerControllers();
    }

    get port() {
        return process.env.PORT || 3000;
    }

    registerControllers() {
        this.app.use('/', new HomeController().router);
        this.app.use('/api', new BotController().router);
    }

    boot(){
        this.app.listen(this.port, ()=> console.log('application running'))
    }
}