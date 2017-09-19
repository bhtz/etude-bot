var UtilsDialog = require('../utils/utils.dialog');

module.exports = class DefaultDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;
        this.intents.onDefault(this.dialog());
    }

    dialog() {
        return [(session) => {
            session.send(`Vous me faîtes un peu peur ... Voici une infos utile !`);
            session.send(UtilsDialog.getLinkCard(
                session, 
                'Météo du jour', 
                "Lyon, 69002",
                'http://www.prevision-meteo.ch/uploads/widget/lyon_0.png', 
                'http://www.prevision-meteo.ch/uploads/widget/lyon_0.png'
            ));
        }];
    }
}
