var builder = require('botbuilder');
var UtilsDialog = require('../utils/utils.dialog');

module.exports = class TechnicalDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('technical_informations', this.dialog());
    }

    dialog() {
        return [(session) => {
            session.send('Pour vos besoins techniques nous avons prévu un portail permettant de vous aider :');
            var card = UtilsDialog.getLinkCard(
                session, 
                'Espace Conception Mobil\'idée', 
                "Concrétisez vos idées d'applications mobiles du matériel ou liées aux technologies digitales", 
                'http://espace-creation-mobilidees.mt.sncf.fr/edm/'
            );
            session.send(card);
        }];
    }
}