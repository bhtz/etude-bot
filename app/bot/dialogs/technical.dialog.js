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
            session.send(UtilsDialog.getLinkCard(
                session, 
                'Espace Conception Mobil\'idée', 
                "Concrétisez vos idées d'applications mobiles du matériel ou liées aux technologies digitales", 
                'http://espace-creation-mobilidees.mt.sncf.fr/edm/'
            ));

            session.send(UtilsDialog.getLinkCardWithImage(
                session, 
                'Accompagnement', 
                "Vous accompagnez de A à Z pendant le développement de votre projet",
                'http://espace-creation-mobilidees.mt.sncf.fr/edm/#/accompagnement',
                'https://etude-bot.herokuapp.com/public/images/analyse.PNG'
            ));

            session.send(UtilsDialog.getLinkCardWithImage(
                session, 
                'Starter Kits', 
                "Vous fournir des socles techniques pour vous faire gagner du temps !", 
                'http://espace-creation-mobilidees.mt.sncf.fr/edm/#/starter',
                'https://etude-bot.herokuapp.com/public/images/starter.PNG'
            ));

            session.send(UtilsDialog.getLinkCardWithImage(
                session, 
                'Documentation', 
                "Et vous fournir un maximum de documentation", 
                'http://espace-creation-mobilidees.mt.sncf.fr/edm/#/documentation',
                'https://etude-bot.herokuapp.com/public/images/documentation.PNG'
            ));
        }];
    }
}