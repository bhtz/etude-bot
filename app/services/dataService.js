var _ = require('lodash');
var data = require('../data/data.json');

module.exports = class DataService {

    constructor(){}

    getAll(){
        return data;
    }

    get(id){
        return _.filter(data, (item) => { return item.id == id });
    }
}