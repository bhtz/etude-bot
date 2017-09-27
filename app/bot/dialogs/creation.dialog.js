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
            (session, args) => { 
                 // Get project name
                var theme = builder.EntityRecognizer.findEntity(args.entities, 'themeProjet');

                if (!theme){
                    builder.Prompts.text(session, "Oh une nouvelle idée, très bonne idée ! Quel serait le thème de cette nouvelle idée ?"); 
                }
                else{
                    session.userData.projet = theme;
                    session.send("je suis dans le next du theme");
                    next();
                }
            },
            (session, results) => {
                session.send("je suis dans la partie 2");
                if (results.response||session.userData.projet) {
                    session.send("je suis dans le si");
                    //Récupération du theme saisie
                    if (results.response) {
                        session.userData.projet = theme;
                    }

                    session.send("Il semble que j'ai ce qui pourrait être utile.");
                    session.send("J'ai préparé pour toi le formulaire de création de l'idée sur la thématique "+session.userData.projet);
                    var card = UtilsDialog.getLinkCard(
                        session,
                        'Portail Mobil\'idée',
                        "Nouvelle Mobil\'idée",
                        'http://mobilidees.mt.sncf.fr/#/propose'
                    );
                    session.send(card);

                    builder.Prompts.confirm(session, "Avant d'ajouter l'idée, si besoin je peux t'aider à savoir si une idée ou une application n'existe pas déjà, ça t'intéresse ?", { yes: 'Oui', no: 'Non' });
                    session.userData.projet = results.response;
                   
                }
                else{
                    session.send("Tant pis, mais n'hésite pas à revenir vers moi si tu souhaites des informations");
                    session.endDialog();
                }
            },
            (session, results) => {
                if (results.response) { 
                    session.beginDialog('projectDetailDialog');
                }
                else{
                    session.send("C'est noté, n'hésite pas à venir me revoir si besoin !");
                    session.endDialog();
                }
            }
        ];
    }
}
