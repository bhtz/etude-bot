var builder = require('botbuilder');

var DataService = require('../../services/dataService');

module.exports = class WelcomeDialog {
    
        constructor(bot, intents) {
            this.bot = bot;
            this.intents = intents;

            this.bot.dialog('mainDialogBye', this.mainDialogBye());

            this.intents.matches('polite_bye', this.mainDialogBye());
        }
        
        /**
         *  Dialog: Main dialog bye
         */
        mainDialogBye() {
            return [(session) => { 
                builder.Prompts.confirm(session, `Etes-vous satisfait des réponses que je vous ai apporté?`, {yes: 'Oui', no: 'Non'});
            },
            (session, args, next) => {
                if(args.response) {
                    session.send(`Parfait, je vous souhaite une bonne journée.`);
                    next();
                }else {
                    builder.Prompts.text(session, "Pourriez-vous préciser brièvement les raisons pour lesquelles vous n'êtes pas pleinement satisfait?");
                }
            },
            (session, args, next) => {
                if(args.response) {
                    session.send(`Merci d'avoir pris le temps de me répondre :)`);
                }

                // TODO Mettre à jour l'avis de l'utilisateur
                session.send(`N'hésitez pas à revenir discuter avec moi si vous avez d'autres questions.`);
                session.endDialog();
            }];
        }

    }
    