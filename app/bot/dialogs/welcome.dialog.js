module.exports = class WelcomeDialog {
    
        constructor(bot, intents) {
            this.bot = bot;
            this.intents = intents;
    
            this.intents.matches('welcome', this.dialog());
        }
    
        dialog() {
            return [(session) => { 
                session.send(`Bonjour je suis MIA (Mobil\'Idée Assistant)! \n\n Posez moi vos questions, je me ferai une joie de vous répondre !`);
            }];
        }
    }
    