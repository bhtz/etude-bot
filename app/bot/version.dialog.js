var builder = require('botbuilder');
var DataService = require('../services/dataService');
var _ = require('lodash');

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

    id() {
        var choices = {};
        return [
            (session) => { builder.Prompts.text(session, 'Quel est l\'ID de votre mobil\'idées ?') },
            (session, results) => {
                session.id = results.response;
                var idea = this.dataService.get(session.id)[0];
                session.send('Le nom de votre mobil\idées est : ' + idea.name);
                var data = this.dataService.getAll();
                _.map(data, (item) => {
                    choices[item.name] = { id: item.id };
                });
                console.log(choices[0]);
                builder.Prompts.choice(session, "Connaissez vous ces mobil\idées ?", choices);
            },
            (session, results) => {
                var id = choices[results.response.entity].id;
                var idea = this.dataService.get(id)[0];
                session.choosenIdea = idea;
                builder.Prompts.confirm(session, 'Voulez vous contacter le propriétaire de cette mobil\'idées ?');
            },
            (session, results) => {
                if (results.response) {
                    session.send('Nous allons contacter le propriétaire de cette mobil\idée !!');
                } else {
                    session.send('C\'est noté, contactez nous pour vos besoins !');
                }
            }
        ]
    }

    default() {
        return [
            (session, args, next) => {
                session.send('Bonjour je suis BOT DDSIM !');
                session.beginDialog('/id');
            }
        ];
    }
}