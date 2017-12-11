var builder = require('botbuilder');
var UtilsDialog = require('../utils/utils.dialog');

module.exports = class AboutDialog {

    constructor(bot, intents) {
        this.bot = bot;
        this.intents = intents;

        this.intents.matches('about_MIA', this.dialog());
    }

    dialog() {
        return [
            (session, args, next) => {
                    //Consutruction du message
                    var message = "Je suis **MIA** : un _tchatBot_ ou _chatBot_, ou encore un _agent Conversationnel_, c’est-à-dire un programme ";
                    message = message +"informatique capable de simuler une conversation avec un ou plusieurs humains par échange vocal ou textuel. <br/> ";
                    message = message +"Je peux t'aider sur les sujets relatifs à la Mobilité au Matériel, voici un petit panel de mes fonctionnalités <br/>";
                    message = message +"* Informer  sur le processus Mobil'idées <br/>";
                    message = message +"* Faciliter la création de Mobil'idées​<br/>";
                    message = message +"* rechercher des informations sur une application ​<br/>";
                    message = message +"* Rechercher des applications existantes sur un thème​<br/>";
                    message = message +"* Orienter les développeurs ou créateurs d'idées<br/>";
                    message = message +"* Aider les utilisateurs d'applications mobiles M​<br/>";
                    message = message +"* Répondre à une question technique <br/>";
                    message = message +"* Donner des informations sur les MatMobiles";
                    
                    message = message +"<br/>Comment puis je t'aider ?";

                    //session.send(message);
                    session.send(session.preferredLocale() );
            }
        ];
    }
}
