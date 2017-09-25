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
            (session) => { 
                builder.Prompts.text(session, "Tu veux ajouter une nouvelle idée, très bonne idée ! Peux tu me donner le titre que tu souhaites lui donner ?"); 
            },
            (session, results) => {
                if (results.response) {
                    session.send("Il semble que j'ai ce qui pourrait être utile.");
                    session.send("J'ai préparé pour toi le formulaire de création de l'idée. Pour rappel, voici le thème : "+results.response);
                    var card = UtilsDialog.getLinkCard(
                        session,
                        'Portail Mobil\'idée',
                        "Nouvelle Mobil\'idée",
                        'http://mobilidees.mt.sncf.fr/#/propose'
                    );
                    session.send(card);
                    session.send("Remarque : avant d'ajouter l'idée, si besoin je peux t'aider à savoir si une idée ou une application n'existe pas déjà");
                    session.endDialog();
                }
                else{
                    session.send("Tant pis, mais n'hésite pas à revenir vers moi si tu souhaites des informations");
                    session.endDialog();
                }
            }
        ];
    }
}
