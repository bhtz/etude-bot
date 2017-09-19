var UtilsDialog = require('../utils/utils.dialog');

module.exports = class DefaultDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;
        this.intents.onDefault(this.dialog());
    }

    dialog() {
        return [(session) => {
            let num = this.getRandom(1, 4);
            switch (num) {
                case 1:
                    this.weitherCard(session);
                    break;

                case 2:
                    this.noUnderstand(session);
                    break;

                case 3:
                    this.noUnderstandTier(session);
                    break;

                case 4:
                    this.noUnderstandBis(session);
                    break;
            }
        }];
    }

    getRandom(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    weitherCard(session) {
        session.send(`Vous me faîtes un peu peur ... Voici une infos utile !`);
        session.send(UtilsDialog.getLinkCardWithImage(
            session,
            'Météo du jour',
            "Lyon, 69002",
            'http://www.prevision-meteo.ch/uploads/widget/lyon_0.png',
            'http://www.prevision-meteo.ch/uploads/widget/lyon_0.png'
        ));
    }

    noUnderstand(session) {
        session.send(`Je ne vous comprend pas humain !`);
    }

    noUnderstandBis(session) {
        session.send(`Je ne vois pas ce que vous voulez dire, mais ça à l'air sympas !`);
    }

    noUnderstandTier(session) { 
        session.send(`Vous n\'êtes pas censé poser ce genre de questions à votre assistant.`);
    }
}
