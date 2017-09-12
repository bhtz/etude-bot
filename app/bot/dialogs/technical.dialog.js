module.exports = class TechnicalDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('technical_informations', this.dialog());
    }

    dialog() {
        return [(session) => session.send('Intention matché: technical_informations')];
    }
}