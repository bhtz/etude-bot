var builder = require('botbuilder');
var UtilsDialog = require('../utils/utils.dialog');

module.exports = class DeploymentDialog {

    constructor(bot, intents){
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('deployment', this.dialog());
    }

    dialog(){
        var envs = ['développement', 'pilote', 'production'];
        return [
            (session) => {
                session.send('Le processus de déploiement d\'une application dépend de l\'environnement.');
                builder.Prompts.choice(session, 'Quel environnement ciblez-vous ?', envs, { listStyle: builder.ListStyle.list });
            },
            (session, results) => {
                var response = results.response.entity;
                switch (response) {
                    case 'développement':
                        session.send('En phase de développement, votre référent technique est habilité à déployer votre application sur la plateforme "DEVBOX".\n\nJe vous invite donc à vous rapprocher de votre référent technique.');
                        session.send('Pour toute information complémentaire, n\'hésitez pas à contacter le support PMM.');
                        this.sendSupportCard(session);
                        break;
                    case 'pilote':
                        session.send('En phase pilote, vous devez effectuer une demande de déploiement sur la plateforme "SANDBOX".\n\nPour cela il faut utiliser le formulaire de demande d\'assistance sur le portail Mobil\'idées.');
                        var card = UtilsDialog.getLinkCard(
                            session,
                            'Portail Mobil\'idées',
                            'Demande d\'assistance',
                            'http://mobilidees-dev.mt.sncf.fr/#/assistance'
                        );
                        session.send(card);
                        break;
                    case 'production':
                        session.send('Le déploiement d\'une application en production est réalisé uniquement par l\'équipe support PMM');
                        this.sendSupportCard(session);
                        break;
                }
            }
        ];
    }

    sendSupportCard(session) {
        var card = UtilsDialog.getLinkCard(
            session,
            'Support PMM',
            '*PMM-Support <<PMM-support@sncf.fr>>',
            'mailto://PMM-support@sncf.fr'
        );
        session.send(card);
    }
}