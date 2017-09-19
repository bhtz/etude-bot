var builder = require('botbuilder');

module.exports = class UtilsDialog {

    constructor(){}

    /**
     * Return formated card
     * @param {bot session} session 
     * @param {string} title 
     * @param {string} subtitle 
     * @param {url} link 
     */
    static getLinkCard(session, title, subtitle, link) {
        return new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title(title)
                    .subtitle(subtitle)
                    .images([builder.CardImage.create(session, '')])
                    .tap(builder.CardAction.openUrl(session, link))
            ]);
    }

    /**
     * Return Hero card with image
     * @param {*} session 
     * @param {*} title 
     * @param {*} subtitle 
     * @param {*} link 
     * @param {*} imageUrl 
     */
    static getLinkCardWithImage(session, title, subtitle, link, imageUrl) {
        return new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title(title)
                    .subtitle(subtitle)
                    .images([builder.CardImage.create(session, imageUrl)])
                    .tap(builder.CardAction.openUrl(session, link))
            ]);
    }
}