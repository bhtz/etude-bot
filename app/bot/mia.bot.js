var builder = require('botbuilder');
var DefaultDialog = require('./dialogs/default.dialog');
var ProcessDialog = require('./dialogs/process.dialog');
var ProjectDialog = require('./dialogs/project.dialog');
var TechnicalDialog = require('./dialogs/technical.dialog');
var CreationDialog = require('./dialogs/creation.dialog');
var DeploymentDialog = require('./dialogs/deployment.dialog');
var WelcomeDialog = require('./dialogs/welcome.dialog');
var AboutDialog = require('./dialogs/about.dialog');
var ByeDialog = require('./dialogs/bye.dialog');

class MiaBot {
    
    constructor() {
        //var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cac0a65b-9aa6-4a44-b22f-6edfbf41642a?subscription-key=4003a1ce79a243d9b1da9f4258f678e0&timezoneOffset=0&verbose=true&q=');
        var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cac0a65b-9aa6-4a44-b22f-6edfbf41642a?subscription-key=0781866b38c5464591e0868a46211cc5&timezoneOffset=0&verbose=true&q=');

        this.connector = new builder.ChatConnector({ appId: 'aa8cbc27-5f99-431b-b14e-66bb5946b9e5', appPassword: 'hqbwfEpRb2fMDE5JBudS6V0' });
        this.bot = new builder.UniversalBot(this.connector);
        
        //Send welcome message before user ask
        var bot = this.bot;
        this.bot.on('conversationUpdate', function (message) {
            if (message.membersAdded) {
                message.membersAdded.forEach(function (identity) {
                    if (identity.id === message.address.bot.id) {
                        bot.send(new builder.Message()
                            .address(message.address)
                            .text("Bonjour je suis MIA (Mobil\'Idée Assistant)! \n\n Posez moi vos questions, je me ferai une joie de vous répondre !"));
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
        new ByeDialog(this.bot, this.intents);
    }

    mount(){
        return this.connector;
    }
}

module.exports = new MiaBot().mount();