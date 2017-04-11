var express = require('express');
var swig = require('swig');
var HomeController = require('./controllers/home.controller');
var BotController = require('./controllers/bot.controller');

/**
 * 
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
        this.app.use('/', new HomeController().router);
        this.app.use('/api', new BotController().router);
    }

    registerConfigurations() {
        this.app.engine('html', swig.renderFile);
        this.app.set('view engine', 'html');
        this.app.set('views', __dirname + '/views');
        swig.setDefaults({ cache: false });
    }

    boot() {
        this.app.listen(this.port, () => console.log('application running'))
    }
}