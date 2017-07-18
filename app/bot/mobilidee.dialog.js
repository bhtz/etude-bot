var _ = require('lodash');
var builder = require('botbuilder');
var DataService = require('../services/dataService');

/**
 * Mobil'idée process dialog
 */
module.exports = class MobilideeDialog {

    constructor(bot) {
        this.bot = bot;
        this.recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/674aacbe-f3aa-4b51-bca9-07e394754424?subscription-key=69597c642a784c1383f2ced9c1d21bab&timezoneOffset=1.0&verbose=true&q=');
        this.intents = new builder.IntentDialog({ recognizers: [this.recognizer] });
        this.dataService = new DataService();

        this.bot.dialog('/', this.intents);
        this.bot.dialog('/id', this.mobilidee());

        this.intents.matches('version', this.version());
        this.intents.matches('easter', this.easter());
        this.intents.onDefault(this.default());
    }

    version() {
        return [(session) => session.send('Ma version est 1.0 !')];
    }

    mobilidee() {
        var choices = {};
        return [
            (session) => { builder.Prompts.text(session, 'Quel est l\'ID de votre mobil\'idées ?'); },
            (session, results) => {
                session.id = results.response;
                var idea = this.dataService.get(session.id)[0];

                if (idea) {
                    session.send('J\'ai trouvé votre mobil\'idées :');
                    session.send(this.sendLinkCard(session, idea));

                    var data = this.dataService.getAll();
                    _.map(data, (item) => {
                        choices[item.name] = { id: item.id };
                    });

                    builder.Prompts.choice(session, "Ces mobil\'idées sont fonctionnellement proche de la votre, entrez un numéro dans la liste ci-dessous: ", choices);
                } else {
                    session.send('Aucune mobil\'idées ne possède cet ID !');
                    session.endDialog();
                }
            },
            (session, results) => {
                var id = choices[results.response.entity].id;
                var idea = this.dataService.get(id)[0];
                session.userData.choosenIdea = idea;
                var pdfUrl = this.getPdfUrl(idea.id);

                session.send(this.sendLinkCard(session, idea));
                session.send(this.sendPdfCard(session, idea));

                builder.Prompts.confirm(session, 'Voulez vous contacter le propriétaire de cette mobil\'idées ?');
            },
            (session, results) => {
                if (results.response) {
                    var name = session.userData.choosenIdea.user.firstName + ' ' + session.userData.choosenIdea.user.lastName;

                    var msg = '[Contactez '+ name +'](mailto:'+ session.userData.choosenIdea.user.email +'&subject=Processus mobil\'idée)';
                    session.send(msg);
                } else {
                    session.send('C\'est noté, contactez nous pour vos besoins !');
                }
            }
        ];
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

    getPdfUrl(id) {
        return 'http://pmm.mt.sncf.fr:11080/caasm-backoffice/projectWS/getPdf?id=' + id + '&type=complet';
    }

    sendPdfCard(session, idea) {
        return new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Download PDF")
                    .subtitle(idea.name)
                    .tap(builder.CardAction.openUrl(session, this.getPdfUrl(idea.id)))
            ]);
    }

    sendLinkCard(session, idea) {
        return new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Fiche mobil\'idees")
                    .subtitle(idea.name)
                    .tap(builder.CardAction.openUrl(session, 'https://mobilidees.mt.sncf.fr/#/proposals/' + idea.id))
            ]);
    }
};