var _ = require('lodash');
var builder = require('botbuilder');
var DataService = require('../services/dataService');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
                session.userData.projectRefId = results.response;
                this.dataService.get(session.userData.projectRefId).then((data) => {
                    var idea = data.document.project;

                    if (idea) {
                        session.send('J\'ai trouvé votre mobil\'idées :');
                        session.send(this.sendLinkCard(session, idea));

                        session.send('Ces mobil\'idées sont fonctionnellement proche de la votre:');

                        this.dataService.getSimilar(session.userData.projectRefId, 'pmmt10811', false, 3).then((data) => {
                            _.map(data.document.project, (item) => {
                                choices[item.name] = { id: item.id };

                                session.send(this.sendLinkCard(session, item));
                            });

                            builder.Prompts.choice(session, "Selectionnez celle qui matche", choices);
                        }).catch(function (err) {
                            console.log(err);
                            session.send(err);
                        });
                    } else {
                        session.send('Aucune mobil\'idées ne possède cet ID !');
                        session.endDialog();
                    }
                });

            },
            (session, results) => {
                var id = choices[results.response.entity].id;

                this.dataService.get(id).then((data) => {
                    var idea = data.document.project;
                    session.userData.matchIdea = idea;

                    builder.Prompts.text(session, 'Pouvez vous nous donner votre commentaire sur la proximité fonctionnelle');
                });
            },
            (session, results) => {
                console.log('ref: ' + session.userData.projectRefId + ' match: ' + session.userData.matchIdea.id);
                this.dataService.update('pmmt10811', session.userData.projectRefId, session.userData.matchIdea.id, "test", true).then((data) => {
                    if(data.document.error){
                        session.send(data.document.error.message);
                    }else{
                        session.send('Merci, nous avons pris en compte vos commentaires !');
                    }
                }).catch(console.log);
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
                    .title(idea.name)
                    .subtitle("Fiche mobil\'idees")
                    .tap(builder.CardAction.openUrl(session, 'https://mobilidees-rec.mt.sncf.fr/#/proposals/' + idea.id))
            ]);
    }
};