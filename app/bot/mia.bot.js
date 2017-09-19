var builder = require('botbuilder');
var DefaultDialog = require('./dialogs/default.dialog');
var ProcessDialog = require('./dialogs/process.dialog');
var ProjectDialog = require('./dialogs/project.dialog');
var TechnicalDialog = require('./dialogs/technical.dialog');
var MobilideeDialog = require('./dialogs/mobilidee.dialog');
var CreationDialog = require('./dialogs/creation.dialog');
var DeploymentDialog = require('./dialogs/deployment.dialog');
var WelcomeDialog = require('./dialogs/welcome.dialog');

class MiaBot {
    
    constructor() {
        var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cac0a65b-9aa6-4a44-b22f-6edfbf41642a?subscription-key=4003a1ce79a243d9b1da9f4258f678e0&timezoneOffset=0&verbose=true&q=');

        this.connector = new builder.ChatConnector({ appId: 'aa8cbc27-5f99-431b-b14e-66bb5946b9e5', appPassword: 'hqbwfEpRb2fMDE5JBudS6V0' });
        this.bot = new builder.UniversalBot(this.connector);
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
        //new MobilideeDialog(this.bot, this.intents);
    }

    mount(){
        return this.connector;
    }
}

module.exports = new MiaBot().mount();