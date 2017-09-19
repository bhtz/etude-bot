var builder = require('botbuilder');
var UtilsDialog = require('../utils/utils.dialog');

module.exports = class DeploymentDialog {

    constructor(bot, intents){
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('deployment', this.dialog());
    }

    dialog(){
        var choices = {};
        return [
            (session) => {
                builder.Prompts.text(session, 'Désirez-vous des informations sur le déploiement d\'une application ?');
            },
            (session, results, next) => {
                var response = results.response.toLowerCase();
                if (response == 'oui') {
                    next();
                } else if (response == 'non') {
                    session.endDialog();
                } else {
                    session.send('Je n\'ai pas compris pas votre réponse.');
                    session.endDialog();
                }
            },
            (session) => {
                session.send('Alors le plus simple est de contacter le support PMM, voici la carte de visite.');
                var card = UtilsDialog.getLinkCard(
                    session,
                    'Support PMM',
                    '*PMM-Support <<PMM-support@sncf.fr>>',
                    'mailto://PMM-support@sncf.fr'
                );
                session.send(card);
            }
        ];
    }
}