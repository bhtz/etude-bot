var builder = require('botbuilder');
var DefaultDialog = require('./dialogs/default.dialog');
var ProcessDialog = require('./dialogs/process.dialog');
var ProjectDialog = require('./dialogs/project.dialog');
var TechnicalDialog = require('./dialogs/technical.dialog');
var CreationDialog = require('./dialogs/creation.dialog');
var DeploymentDialog = require('./dialogs/deployment.dialog');
var WelcomeDialog = require('./dialogs/welcome.dialog');
var AboutDialog = require('./dialogs/about.dialog');
var IncidentDialog = require('./dialogs/incident.dialog');
var ByeDialog = require('./dialogs/bye.dialog');

class MiaBot {
    
    constructor() {
        //var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cac0a65b-9aa6-4a44-b22f-6edfbf41642a?subscription-key=4003a1ce79a243d9b1da9f4258f678e0&timezoneOffset=0&verbose=true&q=');
        var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cac0a65b-9aa6-4a44-b22f-6edfbf41642a?subscription-key=0781866b38c5464591e0868a46211cc5&timezoneOffset=0&verbose=true&q=');

        this.connector = new builder.ChatConnector({ appId: 'aa8cbc27-5f99-431b-b14e-66bb5946b9e5', appPassword: 'hqbwfEpRb2fMDE5JBudS6V0' });
        this.bot = new builder.UniversalBot(this.connector, {
            localizerSettings: { defaultLocale: "fr" }
        });
        
        //Send welcome message before user ask
        var bot = this.bot;
        this.bot.on('conversationUpdate', function (message) {
            if (message.membersAdded) {
                message.membersAdded.forEach(function (identity) {
                    if (identity.id === message.address.bot.id) {
                        bot.send(new builder.Message()
                            .address(message.address)
                            .text(`Bonjour je suis **MIA** (**M**obil\'**I**dée **A**ssistant) ! \n\n Je suis là pour répondre à tes questions.\n\n---\nVoici des exemples de questions que l'on me pose souvent\n\n - _Je veux des infos sur le projet ..._ \n\n - _Je cherche des projets sur ..._\n\n - _Comment dévolopper mon idée ?_\n\n - _Je voudrais créer une application pour gérer ..._\n\n - _J'ai besoin de déployer une application_\n\n - _Comment proposer une idée ?_\n\n - _Je veux tester sur une MatMobile_\n\n ---\nComment puis je t'aider aujourd'hui ? Je me ferai une joie de te répondre !`));
                    }
                });
            }
        });

        this.intents = new builder.IntentDialog({ recognizers: [recognizer] });
        
        this.initDialogs();

    }

    initDialogs(){
        
        this.bot.dialog('/', this.intents);

        new DefaultDialog(this.bot, this.intents);
        new ProcessDialog(this.bot, this.intents);
        new ProjectDialog(this.bot, this.intents);
        new TechnicalDialog(this.bot, this.intents);
        new CreationDialog(this.bot, this.intents);
        new WelcomeDialog(this.bot, this.intents);
        new DeploymentDialog(this.bot, this.intents);
        new AboutDialog(this.bot, this.intents);
        new IncidentDialog(this.bot, this.intents);
        new ByeDialog(this.bot, this.intents);
    }

    mount(){
        return this.connector;
    }
}

module.exports = new MiaBot().mount();