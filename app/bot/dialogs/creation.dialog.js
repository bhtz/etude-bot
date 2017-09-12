module.exports = class CreationDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('creation', this.dialog());
    }

    dialog() {
        return [(session) => session.send('Intention matché: creation')];
    }
}
