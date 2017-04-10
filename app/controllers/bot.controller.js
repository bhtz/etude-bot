var express = require('express');
var builder = require('botbuilder');
var VersionDialog = require('../bot/version.dialog');

var connector = new builder.ChatConnector({
    appId: 'aa8cbc27-5f99-431b-b14e-66bb5946b9e5',
    appPassword: 'kyEx6XOnOn5yBFk6UDyoEQC'
});

var bot = new builder.UniversalBot(connector);
var dialog = new VersionDialog(bot);

/**
 * 
 */
module.exports = class BotController {

    constructor() {
        this.router = express.Router();
        this.router.post('/messages', connector.listen());
    }
}