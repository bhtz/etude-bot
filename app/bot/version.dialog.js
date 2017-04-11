var builder = require('botbuilder');
var DataService = require('../services/dataService');

module.exports = class VersionDialog {

    constructor(bot) {
        this.bot = bot;
        this.intents = new builder.IntentDialog();

        this.bot.dialog('/', this.intents);
        this.intents.matches(/^version/i, this.version());
        this.intents.onDefault(this.default());
    }

    version() {
        return [(session) => session.send('Ma version est 1.0 !')]
    }

    default(){
        return [(session, args, next) => { session.send('Bonjour je suis BOT DDSIM')}];
    }
}