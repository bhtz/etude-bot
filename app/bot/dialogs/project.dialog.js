var builder = require('botbuilder');
var util = require('util');
var dateFormat = require('dateformat');

var UtilsDialog = require('../utils/utils.dialog');
var DataService = require('../../services/dataService');

var quests = {  askForProjectName: [
                    'Quel projet recherchez-vous?',
                    'Quelle mobil\'idée recherchez-vous?',
                    'Quel est le nom du projet que vous cherchez?',
                    'Saisissez le nom du projet que vous aimeriez consulter.',
                    'Précisez le nom du projet que vous souhaitez consulter.',
                    'De quel projet s\'agit-il?',
                    'De quelle mobil\'idée s\'agit-il?'],
                askForRestart: [
                    'Voulez-vous effectuer une nouvelle recherche?', 
                    'Voulez-vous rechercher un autre projet?',
                    'Souhaitez-vous consulter une autre mobil\'idée?'],
                projectDetailDialog: {
                    found: {
                        simple: [
                            'J\'ai trouvé une référence pour [%s]!',
                            'J\'ai identifié une mobil\'idée correspondant à vos critères [%s]'],
                        multi: [
                            'J\'ai trouvé %s références qui correspondent à \'%s\':',
                            'J\'ai identifié %s références pour \'%s\':']
                    },
                    notFound: [
                        'Je n\'ai trouvé aucune référence correspondant à \'%s\'...',
                        'Je n\'ai malheureusement pas trouvé de correspondance pour \'%s\'...',
                        'Je ne trouve pas de mobil\'idée pertinente en rapport avec \'%s\''],
                    ask: {
                        simple: [
                                    'Voulez-vous consulter le détail de ce projet?',
                                    'Souhaitez-vous voir le détail du projet?',
                                    'Souhaitez-vous consulter cette mobil\'idée?'],
                        multi: [
                                'Voulez-vous voir le détail de l\'un de ces projets?',
                                'Voulez-vous consulter l\'un de ces projets?',
                                'Souhaitez-vous consulter l\'une de ces mobil\'idées?']
                    }, 
                    choice: [
                        'Saisissez le numéro correspondant au projet que vous souhaitez consulter.',
                        'Quel est le numéro de la mobil\'idée que vous voulez voir?'],
                    show: [
                        'Voici le détail du projet [%s]',
                        'Voici le détail du projet sélectionné [%s]'],
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
            (session, args, next) => {
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
                        next();
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
                    if(!session.dialogData.multi) {// if only one project, show its detail
                        next();
                    }else {
                        let text = this.getRandomText(quests.projectDetailDialog.agree);
                        session.send(text);
                        session.endDialog();
                    }
                }
            },

            // >> Waterfall #3
            (session, params, next) => {
                if(session.dialogData.multi){

                    if(parseInt(params.response)>0 && parseInt(params.response)<=Object.keys( session.dialogData.choices ).length) {
                        this.sendProjectDetail(session, session.dialogData.choices[parseInt(params.response)-1]);
                        session.userData.dontAsk = false;
                    } else {
                        session.send('Votre saisie n\'est pas valide...');
                        session.userData.dontAsk = true;
                    }
                }else{
                    this.sendProjectDetail(session, session.userData.currentProject);
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
                let result = null;
                if (args) {
                    session.userData.projet = null;
                    result = builder.EntityRecognizer.findEntity(args.entities, 'Projet');
                }

                // Prompt for projet
                if(session.userData.projet) {
                    console.log('[DEBUG] There\'s a project in userData!');
                    next();
                }else if (!result) {
                    console.log('[DEBUG] There\'s not project in userData and no identify entity!');
                    session.beginDialog('askForProjectName');
                } else {
                    console.log('[DEBUG] There\'s a project in entity!');
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

                // Prompt for project name
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
           (session, args, next) => {
                // Ask for restart
                if(!session.userData.dontAsk) {
                    session.beginDialog('askForRestart');
                }else {
                    next();
                }
           },

           // >> Waterfall #4
           (session, args) => {
               if(args.response || session.userData.dontAsk) {
                    session.userData.projet = null;
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
                //session.dialogData.choices[index] = {id: item.id, name: item.name};
                session.dialogData.choices[index] = item;
                projectList += (index+1) +' - '+ item.name +'\n\n';
            });

            session.dialogData.multi = true;
            session.send(projectList);
            text = this.getRandomText(quests.projectDetailDialog.ask.multi);
            builder.Prompts.confirm(session, text, {yes: 'Oui', no: 'Non'});
        } else {
            let text = this.getRandomText(quests.projectDetailDialog.found.simple);
            session.send(util.format(text, session.userData.projet));

            session.dialogData.multi = false;

            /*text = this.getRandomText(quests.projectDetailDialog.ask.simple);
            builder.Prompts.confirm(session, text, {yes: 'Oui', no: 'Non'});*/
        }
    }

    /**
     * 
     * @param {*} session 
     * @param {*} project 
     */
    sendProjectDetail(session, project) {
        let text = this.getRandomText(quests.projectDetailDialog.show) + ':';
        session.send(util.format(text, project.name));

        text = 'Description: ' + project.shortDescription + '\n\n';
        text += 'Propriétaire de l\'idée: ' + project.user.firstName + ' ' + project.user.lastName + '\n\n';
        text += 'Date de création de l\'idée: ' + dateFormat(project.creationDate, "dd/mm/yyyy hh:MM:ss");

        var card = UtilsDialog.getLinkCard(
            session,
            project.name,
            text,
            'https://mobilidees-dev.mt.sncf.fr/#/proposals/'+project.id
        );
        session.send(card);
    }
}
