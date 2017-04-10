var builder = require('botbuilder');

module.exports = class VersionDialog {

    constructor(bot) {
        this.bot = bot;
        this.intents = new builder.IntentDialog();

        this.bot.dialog('/', this.intents);
        this.intents.matches(/^version/i, this.version());
    }

    version() {
        return [(session) => session.send('Ma version est 1.0 !')]
    }
}