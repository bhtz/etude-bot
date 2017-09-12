module.exports = class DefaultDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.onDefault(this.dialog());
    }

    dialog() {
        return [(session) => { 
            session.send(`
                Bonjour je suis MIA (Mobil\'Idée Assistant)! \n
                Posez moi vos questions aux sujets du processus mobil'idée, je me ferai une joie de vous répondre !
            `); 
        }];
    }
}
