var express = require('express');
var builder = require('botbuilder');
var MobilideeDialog = require('../bot/mobilidee.dialog');

var connector = new builder.ChatConnector({
    appId: 'aa8cbc27-5f99-431b-b14e-66bb5946b9e5',
    appPassword: 'kyEx6XOnOn5yBFk6UDyoEQC'
});

var bot = new builder.UniversalBot(connector);
var dialog = new MobilideeDialog(bot);

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