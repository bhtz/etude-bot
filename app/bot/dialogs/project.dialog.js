var builder = require('botbuilder');
var DataService = require('../../services/dataService');

module.exports = class ProjectDialog {

    constructor(bot, intents){
        this.bot = bot;
        this.intents = intents;
        this.dataService = new DataService();

        // Main dialog
        this.bot.dialog('mainDialogInfos', this.mainDialogInfos());
        this.bot.dialog('mainDialogSearch', this.mainDialogSearch());

        // Sub dialogs
        this.bot.dialog('askForProjectName', this.askForProjectName());
        this.bot.dialog('projectDetailDialog', this.projectDetailDialog());
        this.bot.dialog('askForRestart', this.askForRestart());

        // Main dialog start up
        this.intents.matches('project_informations', this.mainDialogInfos());
        this.intents.matches('project_search', this.mainDialogSearch());
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
            /*(session) => {
                // Voulez-vous voir le détail du projet?
                builder.Prompts.confirm(session, 'Voulez-vous voir le détail du projet ['+ session.userData.projet +']?', {yes: 'Oui', no: 'Non'});
            },*/
            (session, params, next) => {
                //if(params.response){
                    // todo externaliser l'appel
                    this.dataService.getByTitle(session.userData.projet)
                    .then((data) => {
                        var project = data.document.project;
                        session.dialogData.choices = {};
                        session.userData.currentProject = project;

                        if(project){
                            if(project.length>1){
                                var projectList = '';
                                session.send('J\'ai trouvé '+ project.length +' projets qui correspondent à \''+ session.userData.projet +'\':');
                                project.forEach(function(item, index){
                                    session.dialogData.choices[index] = {id: item.id, name: item.name};
                                    projectList += (index+1) +' - '+ item.name +'\n\n';
                                });
                                session.send(projectList);
                                session.dialogData.multi = true;
                                builder.Prompts.confirm(session, 'Voulez-vous voir le détail de l\'un de ces projets?', {yes: 'Oui', no: 'Non'});
                            } else {
                                session.send('J\'ai trouvé le projet ['+ project.name +']!');
                                session.dialogData.multi = false;
                                builder.Prompts.confirm(session, 'Voulez-vous consulter le détail de ce projet?', {yes: 'Oui', no: 'Non'});
                            }
                        } else {
                            session.send('Je n\'ai trouvé aucun projet correspondant à \''+ session.userData.projet +'\'...');
                            session.endDialog();
                        }
                    });
                /*} else{
                    //session.send('Ok, passons à la suite!');
                    session.endDialog();
                }*/
            },
            (session, params, next) => {
                if(params.response){
                    if(session.dialogData.multi) {
                        builder.Prompts.number(session, 'Saisissez le numéro correspondant au projet que vous souhaitez consulter:');
                    } else {
                        next();
                    }
                }else {
                    session.send('Comme vous voulez...');
                    session.endDialog();
                }
            },
            (session, params, next) => {
                if(session.dialogData.multi){
                    session.send('Voici le détail du projet du projet ['+session.dialogData.choices[parseInt(params.response)-1].name+']');
                }else{
                    session.send('Voici le détail du projet du projet ['+session.userData.currentProject.name+']');
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
     * Dialog: Main dialog informations
     */
    mainDialogSearch() {
        return [
            // >> Waterfall #1
            (session) => {
                session.send('Intention matché: project_search')
            }
        ];
    }

    /**
     * Dialog: Main dialog informations
     */
    mainDialogInfos() {
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
                    session.replaceDialog("mainDialogInfos", { reprompt: true });
               } else {
                    // End of dialog
                    session.send('Fin de project.dialog!');
                    session.endDialog();
               }
           }
        ];
    }
}
