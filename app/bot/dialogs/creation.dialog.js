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
            (session, args, next) => { 
                 // Get project name
                var theme = builder.EntityRecognizer.findEntity(args.entities, 'themeProjet');
               
                //Récupération de l'entity saisie
                var themeIdee = session.dialogData.themeIdee = {
                    theme: theme ? theme.entity : null,
                  };

                if (!themeIdee.theme){
                    builder.Prompts.text(session, "Oh une nouvelle idée, très bonne idée ! Quel serait le thème de cette nouvelle idée ?"); 
                }
                else{
                    next();
                }
            },
            (session, results, next) => {
                //if (results.response||session.userData.projet) {
                var themeIdee = session.dialogData.themeIdee;

                if (results.response) {
                    themeIdee.theme = results.response;
                }

                session.send("Il semble que j'ai ce qui pourrait t'être utile.<br/> J'ai préparé pour toi le formulaire de création de l'idée sur la thématique \""+themeIdee.theme+"\"");
                var card = UtilsDialog.getLinkCard(
                    session,
                    'Portail Mobil\'idée',
                    "Nouvelle Mobil\'idée",
                    'http://mobilidees.mt.sncf.fr/#/propose'
                );
                session.send(card);

                builder.Prompts.confirm(session, "Avant d'ajouter l'idée, si besoin je peux t'aider à savoir si une idée ou une application n'existe pas déjà, ça t'intéresse ?", { yes: 'Oui', no: 'Non' });
                session.userData.projet = themeIdee.theme;
            },
            (session, results) => {
                if (results.response) { 
                    session.beginDialog('mainDialogInfos');
                }
                else{
                    session.send("C'est noté, n'hésite pas à venir me revoir si besoin !");
                    session.endDialog();
                }
            }
        ];
    }
}
