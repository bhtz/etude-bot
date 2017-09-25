var _ = require('lodash');
var util = require('util');
var request = require('request-promise');

var endPointBaseUrl = 'https://portail1.api-np.sncf.fr/materiel/mobilidees/1.0/.json?__sequence=%s';

// Test la présence de la variable d'environnement MIA_RUNTIME_ENV = 'DEV'
if (process.env.MIA_RUNTIME_ENV) {
    console.log('[DEBUG] RUNTIME_ENV is DEV...');
    if (process.env.MIA_RUNTIME_BASEURL && process.env.MIA_RUNTIME_BASEURL!='' ) {
        console.log('[DEBUG] MIA_RUNTIME_BASEURL is set...');
        endPointBaseUrl = process.env.MIA_RUNTIME_BASEURL;
    } else {
        console.log('[DEBUG] MIA_RUNTIME_BASEURL is not set...');
        endPointBaseUrl = 'https://portail3.api-np.sncf.fr/materiel/mobilidees/1.0/.json?__sequence=%s';
    }

    console.log('[DEBUG] endPointBaseUrl: ' + endPointBaseUrl);
}

module.exports = class DataService {

    constructor() { }

    get(id) {
        var opts = {
            uri: util.format(endPointBaseUrl, 'GetProject_Sequence'),
            qs: { id: id },
            json: true
        }
        return request.get(opts);
    }

    getSimilar(id, cp, exclude, max) {
        var opts = {
            uri: util.format(endPointBaseUrl, 'GetMatchingProjetcs_Sequence'),
            qs: {
                projectRefId: id,
                max: max,
                cp: cp,
                excludeMarkedOff: exclude
            },
            json: true
        }
        return request.get(opts);
    }

    getByTitle(title) {
        var opts = {
            uri: util.format(endPointBaseUrl, 'SearchProjects_Sequence'),
            qs: { q: title },
            json: true
        }
        return request.get(opts);
    }

    getByKeyWord() {

    }

    update(cp, projectRefId, projectMatchId, comment, markoff) {
        var options = {
            method: 'POST',
            uri: util.format(endPointBaseUrl, 'UpdateMarkOffProject_Sequence'),
            body: { cp: cp, projectRefId: projectRefId, projectMatchId: projectMatchId, comment: comment, markoff: markoff },
            json: true
        };
        return request.post(options);
    }
};