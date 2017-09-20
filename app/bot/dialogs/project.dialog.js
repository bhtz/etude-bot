var builder = require('botbuilder');

module.exports = class ProjectDialog {

    constructor(bot, intents){
        this.bot = bot;
        this.intents = intents;

        // Main dialog
        this.bot.dialog('mainDialog', this.mainDialog());

        // Sub dialogs
        this.bot.dialog('askForProjectName', this.askForProjectName());
        this.bot.dialog('projectDetailDialog', this.projectDetailDialog());
        this.bot.dialog('askForRestart', this.askForRestart());

        // Main dialog start up
        this.intents.matches('project_informations', this.mainDialog());
    }

    /**
     * Dialog: Ask for project name 
     */
    askForProjectName() {
        return [
            (session) => {
                // Quel est le nom du projet que vous recherchez?
                builder.Prompts.text(session, 'Quel est le nom du projet que vous recherchez?');
            },
            (session, results) => {
                session.endDialogWithResult(results);
            }
        ];
    }

    /**
     * Dialog: Ask for project detail
     */
    projectDetailDialog() {
        return [
            (session) => {
                // Voulez-vous voir le détail du projet?
                builder.Prompts.confirm(session, 'Voulez-vous voir le détail du projet ['+ session.userData.projet +']?', {yes: 'Oui', no: 'Non'});
            },
            (session, params, next) => {
                if(params.response){
                    session.send('Ok, voici le détail du projet ['+ session.userData.projet +']!');
                    session.send('Todo...');
                } else{
                    //session.send('Ok, passons à la suite!');
                }

                session.endDialog();
            }
        ];
    }

    /**
     * Dialog: Ask for restart main dialog
     */
    askForRestart() {
        return [
            (session) => {
                // Voulez-vous consulter un autre projet?
                builder.Prompts.confirm(session, 'Voulez-vous consulter un autre projet?', {yes: 'Oui', no: 'Non'});
            },
            (session, params, next) => {
                session.endDialogWithResult(params);
            }
        ];
    }

    /**
     * Dialog: Main dialog
     */
    mainDialog() {
        return [
            // >> Waterfall #1
            (session, args, next) => {
                
                // Get project name
                var result = builder.EntityRecognizer.findEntity(args.entities, 'Projet');

                // Prompt for projet
                if (!result) {
                    // Quel est le nom du projet que vous recherchez?
                    session.beginDialog('askForProjectName');
                } else {
                    // Store project name
                    session.userData.projet = result.entity
                    next();
                }
            },

            // >> Waterfall #2
            (session, args) => {
                
                // Store project name
                if (args.response) {
                    session.userData.projet = args.response;
                }

                // Prompt for the text of the note
                if (!session.userData.projet) {
                    //Quel est le nom du projet que vous recherchez?
                    builder.Prompts.text(session, 'Quel est le nom du projet que vous recherchez?');
                } else {
                    // Ask for project detail
                    session.beginDialog('projectDetailDialog');
                }
           },

           // >> Waterfall #3
           (session, args) => {
                // Ask for restart
                session.beginDialog('askForRestart');
           },

           // >> Waterfall #4
           (session, args) => {
               if(args.response) {
                    // restart Main loop
                    session.replaceDialog("mainDialog", { reprompt: true });
               } else {
                    // End of dialog
                    session.send('Fin de project.dialog!');
                    session.endDialog();
               }
           }
        ];
    }
}
