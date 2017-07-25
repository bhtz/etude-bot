var _ = require('lodash');
var data = require('./data/data.json');
var similar = require('./data/similar.json');

module.exports = class DataService {

    constructor() { }

    getAll() {
        return data;
    }

    get(id) {
        return _.filter(data, (item) => { return item.id == id; });
    }

    getSimilar(id) {
        return similar.document.project;
    }
};