var express = require('express');

/**
 * Home controller
 */
class HomeController {

    constructor() {
        this.router = express.Router();
        this.router.get('/', this.home.bind(this));
    }

    home(req, res){
        res.send('Welcome to MIA !!');
    }
}

HomeController.baseUrl = '/';

module.exports = HomeController;