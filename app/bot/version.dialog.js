var builder = require('botbuilder');
var DataService = require('../services/dataService');
var _ = require('lodash');

var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/674aacbe-f3aa-4b51-bca9-07e394754424?subscription-key=69597c642a784c1383f2ced9c1d21bab&timezoneOffset=1.0&verbose=true&q=');

/**
 * 
 */
module.exports = class VersionDialog {

    constructor(bot) {
        this.bot = bot;
        this.intents = new builder.IntentDialog({ recognizers: [recognizer] });
        this.dataService = new DataService();

        this.bot.dialog('/', this.intents);
        this.bot.dialog('/id', this.id());

        this.intents.matches('version', this.version());
        this.intents.matches('easter', this.easter());
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
                builder.Prompts.choice(session, "Ces mobil\idées sont fonctionnellement proche de la votre, selectionnez en une", choices);
            },
            (session, results) => {
                var id = choices[results.response.entity].id;
                var idea = this.dataService.get(id)[0];
                session.choosenIdea = idea;
                session.send('['+idea.name+'](https://mobilidees.mt.sncf.fr/#/proposals/'+ idea.id +')');
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
                session.send('Bonjour je suis MIA (Mobil\'Idée Assistant)!');
                session.beginDialog('/id');
            }
        ];
    }

    easter() {
        return [
            (session, args, next) => {
                session.send('Vous me faîtes un peu peur ...');
            }
        ];
    }
}