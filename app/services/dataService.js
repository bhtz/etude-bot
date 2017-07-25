var _ = require('lodash');
var request = require('request-promise');

module.exports = class DataService {

    constructor() { }

    get(id) {
        var opts = {
            uri: 'https://portail1.api-np.sncf.fr/materiel/mobilidees/1.0/.json?__sequence=GetProject_Sequence',
            qs: {id: id},
            json: true
        }
        return request.get(opts);
    }

    getSimilar(id, cp, exclude, max) {
        var opts = {
            uri: 'https://portail1.api-np.sncf.fr/materiel/mobilidees/1.0/.json?__sequence=GetMatchingProjetcs_Sequence',
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
};