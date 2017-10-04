var builder = require('botbuilder');
var UtilsDialog = require('../utils/utils.dialog');

module.exports = class AboutDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('about_MIA', this.dialog());
    }

    dialog() {
        return [
            (session, args, next) => {
                session.send("Je suis MIA, je suis un robot qui pourra t'assister pour toutes tes recherches sur le processus Mobil'idées, sur les projets en cours, "+
                    "sur tout besoin d'assistance dans tes développements.<br/> Comment puis je t'aider ?");
            }
        ];
    }
}
