var UtilsDialog = require('../utils/utils.dialog');

module.exports = class DefaultDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;
        this.intents.onDefault(this.dialog());
    }

    dialog() {
        return [(session) => {
            let num = UtilsDialog.getRandom(1, 4);
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

    weitherCard(session) {
        session.send(`Je ne connais pas bien ce sujet. Mais voici une infos utile !`);
        session.send(UtilsDialog.getLinkCardWithImage(
            session,
            'Météo du jour',
            "Lyon, 69002",
            'http://www.prevision-meteo.ch/uploads/widget/lyon_0.png',
            'http://www.prevision-meteo.ch/uploads/widget/lyon_0.png'
        ));
    }

    noUnderstand(session) {
        session.send(`C’est étrange, je n’ai trouvé aucune information correspondant à votre recherche. Pouvez-vous réessayer avec d’autres mots clés ?`);
    }

    noUnderstandBis(session) {
        session.send(`Désolé, je ne peux actuellement pas répondre à cette question. Puis-je faire autre chose pour vous ?`);
    }

    noUnderstandTier(session) { 
        session.send(`Je n’ai trouvé aucune correspondance. Pouvez-vous recommencer en utilisant des mots différents ou supplémentaires ?`);
    }
}
