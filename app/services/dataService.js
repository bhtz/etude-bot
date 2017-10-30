var _ = require('lodash');
var util = require('util');
var request = require('request-promise');
var environment = require('../configs/environment.json');

/**
 * Data access layer
 */
module.exports = class DataService {

    constructor() { 
        if(process.env.MIA_RUNTIME_ENV){
            this.env = environment.dev;
            console.log('DEV ENV detected');
        }else{
            this.env = environment.prod;
            console.log('PROD ENV detected');
        }
        this.auth = "Basic " + new Buffer(this.env.username + ":" + this.env.password).toString("base64");
    }

    get(id) {
        var opts = {
            uri: util.format(this.env.url, 'GetProject_Sequence'),
            qs: { id: id },
            json: true,
            headers : { "Authorization" : this.auth }
        }
        return request.get(opts);
    }

    getSimilar(id, cp, exclude, max) {
        var opts = {
            uri: util.format(this.env.url, 'GetMatchingProjetcs_Sequence'),
            qs: {
                projectRefId: id,
                max: max,
                cp: cp,
                excludeMarkedOff: exclude,
                headers : { "Authorization" : this.auth }
            },
            json: true
        }
        return request.get(opts);
    }

    getByTitle(title) {
        var opts = {
            uri: util.format(this.env.url, 'SearchProjects_Sequence'),
            qs: { q: encodeURIComponent(title) },
            json: true,
            headers : { "Authorization" : this.auth }
        }
        return request.post(opts);
    }

    getByKeyWord() {

    }

    update(cp, projectRefId, projectMatchId, comment, markoff) {
        var options = {
            method: 'POST',
            uri: util.format(this.env.url, 'UpdateMarkOffProject_Sequence'),
            body: { cp: cp, projectRefId: projectRefId, projectMatchId: projectMatchId, comment: comment, markoff: markoff },
            json: true,
            headers : { "Authorization" : this.auth }
        };
        return request.post(options);
    }

    createMiaSatisfaction(satisfied, comment) {
        var options = {
            method: 'POST',
            uri: util.format(this.env.url, 'CreateMiaSatisfaction_Sequence'),
            body: { satisfied: satisfied, comment: comment },
            json: true,
            headers : { "Authorization" : this.auth }
        };
        return request.post(options);
    }
};