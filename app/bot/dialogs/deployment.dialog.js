module.exports = class DeploymentDialog {

    constructor(bot, intents){
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('deployment', this.dialog());
    }

    dialog(){
        return [(session) => session.send('Pour déployer une application, addressez-vous au support PMM')];
    }
}