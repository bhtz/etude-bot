var builder = require('botbuilder');

var DataService = require('../../services/dataService');

module.exports = class WelcomeDialog {
    
        constructor(bot, intents) {
            this.bot = bot;
            this.intents = intents;
            this.dataService = new DataService();

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
                var satisfied = true;
                var comment = null;

                if(args.response) {
                    satisfied = false;
                    comment = args.response;
                    session.send(`Merci d'avoir pris le temps de me répondre :)`);
                }

                this.dataService.createMiaSatisfaction(satisfied, comment)
                .then((data) => {
                    console.log("Creation successful!");
                    session.send(`N'hésitez pas à revenir discuter avec moi si vous avez d'autres questions.`);
                })
                .catch((e) => {
                    console.log("ERROR " + e);
                });

                session.endDialog();
            }];
        }

        
    }
    