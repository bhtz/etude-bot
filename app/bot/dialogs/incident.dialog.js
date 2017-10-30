var builder = require('botbuilder');
var UtilsDialog = require('../utils/utils.dialog');

module.exports = class IncidentDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('incident', this.dialog());
    }

    dialog() {
        return [
            (session, args, next) => {
                session.send('incident intent detected');
            }
        ];
    }
}
