var express = require('express');

module.exports = class HomeController {

    constructor(){
        this.router = express.Router();
        this.router.get('/', this.home.bind(this));
    }

    home(req, res){
        res.send('Hello world');
    }
}