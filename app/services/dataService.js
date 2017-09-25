var _ = require('lodash');
var request = require('request-promise');
var baseUrl = 'https://portail1.api-np.sncf.fr/materiel/mobilidees/1.0/.json?__sequence=';
//var baseUrl = 'https://portail3.api-np.sncf.fr/materiel/mobilidees/1.0/.json?__sequence=';

module.exports = class DataService {

    constructor() { }

    get(id) {
        var opts = {
            uri: baseUrl+'GetProject_Sequence',
            qs: { id: id },
            json: true
        }
        return request.get(opts);
    }

    getSimilar(id, cp, exclude, max) {
        var opts = {
            uri: baseUrl+'GetMatchingProjetcs_Sequence',
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
            uri: baseUrl+'SearchProjects_Sequence',
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
            uri: baseUrl+'UpdateMarkOffProject_Sequence',
            body: { cp: cp, projectRefId: projectRefId, projectMatchId: projectMatchId, comment: comment, markoff: markoff },
            json: true
        };
        return request.post(options);
    }
};