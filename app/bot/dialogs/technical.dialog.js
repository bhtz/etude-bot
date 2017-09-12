var builder = require('botbuilder');

module.exports = class TechnicalDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('technical_informations', this.dialog());
    }

    dialog() {
        return [(session) => {
            session.send('Pour vos besoins technique nous avons prévu un portail permettant de vous aider :');
            session.send(this.sendLinkCard(session));
        }];
    }

    sendLinkCard(session) {
        return new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title('Espace Conception Mobil\'idée')
                    .subtitle("Concrétisez vos idées d'applications mobiles du matériel ou liées aux technologies digitales")
                    .tap(builder.CardAction.openUrl(session, 'http://espace-creation-mobilidees.mt.sncf.fr/edm/'))
            ]);
    }
}