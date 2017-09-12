module.exports = class ProjectDialog {

    constructor(bot, intents){
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('project_informations', this.dialog());
    }

    dialog(){
        return [(session) => session.send('Intention matché: project_informations')];
    }
}