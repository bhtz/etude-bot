var builder = require('botbuilder');
var UtilsDialog = require('../utils/utils.dialog');

module.exports = class ProcessDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('process_informations', this.dialog());
    }

    dialog() {
        return [
            (session) => {
                session.send('Mobil\'idée est le portail permettant à tous les agents du Matériel de proposer des idées d\'applications mobiles. Chaque idée est ensuite analysée par un comité dédié pour l\'orienter au mieux (prototypage facilité, rapprochement, recensement ...).');
                session.send(UtilsDialog.getLinkCard(
                    session,
                    'Portail mobil\'idées',
                    '',
                    'http://mobilidees.mt.sncf.fr'
                ));
                builder.Prompts.confirm(session, 'Voulez-vous avoir plus d\'information sur ce sujet ?', { yes: 'Oui', no: 'Non' });
            },
            (session, results) => {
                if (results.response) {
                    session.send('Vous trouverez une description plus complète (vidéos d\'explication, document de présentation) dans l\'espace documentaire Mobil\'idées en suivant ce lien:');
                    session.send(UtilsDialog.getLinkCard(
                        session,
                        'Présentation mobil\'idées',
                        '',
                        'https://sncf.sharepoint.com/sites/MobilideesSP/SitePages/Presentation-Mobil\'id%C3%A9es.aspx'
                    ));
                } else {
                    session.send('C\'est noté, n\'hésitez pas !');
                    session.say('C\'est noté, n\'hésitez pas !', 'beaucoup trop cool cortana');
                }
            },
        ];
    }
}
