var builder = require('botbuilder');
var DataService = require('../services/dataService');

module.exports = class VersionDialog {

    constructor(bot) {
        this.bot = bot;
        this.intents = new builder.IntentDialog();
        this.dataService = new DataService();

        this.bot.dialog('/', this.intents);
        this.bot.dialog('/id', this.id());

        this.intents.matches(/^version/i, this.version());
        this.intents.onDefault(this.default());
    }

    version() {
        return [(session) => session.send('Ma version est 1.0 !')]
    }

    id(){
        return [
            (session) => { builder.Prompts.text(session, 'Quel est l\'ID de votre mobil\'idées ?')},
            (session, results) => { 
                session.id = results.response; 
                var idea = this.dataService.get(session.id);
                session.send(idea.shortDescription); 
            }
        ]
    }

    default(){
        return [
            (session, args, next) => { 
                session.send('Bonjour je suis BOT DDSIM !');
                session.beginDialog('/id');
            }
        ];
    }
}