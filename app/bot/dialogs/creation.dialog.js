var builder = require('botbuilder');
var UtilsDialog = require('../utils/utils.dialog');

module.exports = class CreationDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('creation', this.dialog());
    }

    dialog() {
        return [
            (session, results) => {
                session.send("Je vous invite à remplir le formulaire suivant pour renseigner votre mobil'idée");
                var card = UtilsDialog.getLinkCard(
                    session,
                    'Portail Mobil\'idée',
                    "Nouvelle Mobil\'idée",
                    'http://mobilidees.mt.sncf.fr/#/propose'
                );
                session.send(card);
            }
        ];
    }
}
