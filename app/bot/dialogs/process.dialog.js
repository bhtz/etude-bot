module.exports = class ProcessDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('process_informations', this.dialog());
    }

    dialog() {
        return [(session) => session.send('Intention matché: process_informations')];
    }
}
