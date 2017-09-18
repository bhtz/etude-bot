var builder = require('botbuilder');

module.exports = class ProjectDialog {

    constructor(bot, intents){
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('project_informations', this.dialog());
    }

    dialog(){
        return [
            (session, args, next) => {
                var result = builder.EntityRecognizer.findEntity(args.entities, 'Projet');
                session.send('intention: project_informations, entity: '+ result.entity);
            }
        ];
    }
}