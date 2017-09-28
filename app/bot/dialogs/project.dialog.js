var builder = require('botbuilder');
var util = require('util');

var UtilsDialog = require('../utils/utils.dialog');
var DataService = require('../../services/dataService');

var quests = {  askForProjectName: [
                    'Quel projet recherchez-vous?',
                    'Quel est le nom du projet que vous recherchez?',
                    'Saisissez le nom du projet que vous recherchez.',
                    'Précisez le nom du projet que vous souhaitez consulter.',
                    'De quel projet s\'agit-il?'
                ],
                askForRestart: [
                    'Voulez-vous effectuer une nouvelle recherche?', 
                    'Voulez-vous rechercher un autre projet?'],
                projectDetailDialog: {
                    found: {
                        simple: ['J\'ai trouvé la référence [%s]!'],
                        multi: ['J\'ai trouvé %s références qui correspondent à \'%s\':']
                    },
                    notFound: ['Je n\'ai trouvé aucune référence correspondant à \'%s\'...',
                                'Je n\'ai malheureusement pas trouvé de correspondance pour \'%s\'...'],
                    ask: {
                        simple: [
                                    'Voulez-vous consulter le détail de ce projet?',
                                    'Souhaitez-vous voir le détail du projet?'
                        ],
                        multi: [
                                'Voulez-vous voir le détail de l\'un de ces projets?',
                                'Voulez-vous consulter l\'un de ces projets?'
                        ]
                    }, 
                    choice: [
                        'Saisissez le numéro correspondant au projet que vous souhaitez consulter.'
                    ],
                    show: ['Voici le détail du projet du projet [%s]'],
                    agree: [
                        'Comme vous voulez...',
                        'Comme vous le souhaitez...',
                        'D\'accord!'
                    ]
                }
            };

module.exports = class ProjectDialog {

    /**
     * Constructor
     * @param {*} bot 
     * @param {*} intents 
     */
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
                let text = this.getRandomText(quests.askForProjectName);
                builder.Prompts.text(session, text);
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
            // >> Waterfall #1
            (session) => {
                // call mobilidees api to search project by title
                this.dataService.getByTitle(session.userData.projet)
                .then((data) => {
                    var project = data.document.project;
                    session.dialogData.choices = {};
                    session.userData.currentProject = project;

                    // if project exists
                    if(project){
                        // Send project(s) list to user
                        this.sendProjects(session, project);
                    } else {
                        session.dialogData.no_result = true;
                        let text = this.getRandomText(quests.projectDetailDialog.notFound);
                        session.send(util.format(text, session.userData.projet));

                        session.endDialog();
                    }
                });
            },

            // >> Waterfall #2
            (session, params, next) => {
                if(params.response){
                    if(session.dialogData.multi) {
                        let text = this.getRandomText(quests.projectDetailDialog.choice);
                        builder.Prompts.number(session, text);
                    } else {
                        next();
                    }
                }else {
                    let text = this.getRandomText(quests.projectDetailDialog.agree);
                    session.send(text);
                    session.endDialog();
                }
            },

            // >> Waterfall #3
            (session, params, next) => {
                let text = this.getRandomText(quests.projectDetailDialog.show);
                if(session.dialogData.multi){
                    session.send(util.format(text, session.dialogData.choices[parseInt(params.response)-1].name));
                }else{
                    session.send(util.format(text, session.userData.currentProject.name));
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
                let text = this.getRandomText(quests.askForRestart);
                builder.Prompts.confirm(session, text, {yes: 'Oui', no: 'Non'});
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
                let result = builder.EntityRecognizer.findEntity(args.entities, 'Projet');

                // Prompt for projet
                if (!result) {
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
                    let text = this.getRandomText(quests.askForProjectName);
                    builder.Prompts.text(session, text);
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
                    let text = this.getRandomText(quests.projectDetailDialog.agree);
                    session.send(text);
                    session.endDialog();
               }
           }
        ];
    }

    /**
     * Function: Get random text
     * @param {*} obj 
     */
    getRandomText(obj) {
        let rdm = UtilsDialog.getRandom(0, obj.length-1);
        return obj[rdm];
    }

    /**
     * Function: Send projects list to user
     * @param {*} session 
     * @param {*} project 
     */
    sendProjects(session, project) {
        if(project.length>1){
            let projectList = '';
            let text = this.getRandomText(quests.projectDetailDialog.found.multi);
            session.send(util.format(text, project.length, session.userData.projet));

            project.forEach(function(item, index){
                session.dialogData.choices[index] = {id: item.id, name: item.name};
                projectList += (index+1) +' - '+ item.name +'\n\n';
            });

            session.send(projectList);
            session.dialogData.multi = true;
            text = this.getRandomText(quests.projectDetailDialog.ask.multi);
            builder.Prompts.confirm(session, text, {yes: 'Oui', no: 'Non'});
        } else {
            let text = this.getRandomText(quests.projectDetailDialog.found.simple);
            session.send(util.format(text, session.userData.projet));

            session.dialogData.multi = false;

            text = this.getRandomText(quests.projectDetailDialog.ask.simple);
            builder.Prompts.confirm(session, text, {yes: 'Oui', no: 'Non'});
        }
    }
}
