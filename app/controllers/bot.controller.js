var express = require('express');
var connector = require('../bot/mia.bot');

/**
 * ChatBot HTTP Endpoints controller
 */
class BotController {

    constructor() {
        this.router = express.Router();

        this.router.post('/messages', connector.listen());
    }
}

BotController.baseUrl = '/api';

module.exports = BotController;