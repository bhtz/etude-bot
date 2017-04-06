var express = require('express');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

module.exports = class BotController {

    constructor(){
        this.router = express.Router();
        //this.router.post('/messages', connector.listen());
    }
}