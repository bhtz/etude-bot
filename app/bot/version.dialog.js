var builder = require('botbuilder');

intents.matches(/^version/i, );

module.exports = class VersionDialog {

    constructor(bot){
        this.bot = bot;
        this.intents = new builder.IntentDialog();
        this.registerDialogs();
    }

    registerDialogs(){
        this.bot.dialog('/', this.version());
    }

    version(){
        return [
            (session) => session.send('Ma version est 1.0 !')  
        ]
    }
}