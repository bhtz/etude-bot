var express = require('express');
var pkg = require('../../package.json');

/**
 * Home controller
 */
class HomeController {

    constructor() {
        this.router = express.Router();
        this.router.get('/', this.home.bind(this));
    }

    home(req, res) {
        var msg = { application: 'com.ddsim.sncf.mia', version: pkg.version };
        res.json(msg);
    }
}

HomeController.baseUrl = '/';

module.exports = HomeController;