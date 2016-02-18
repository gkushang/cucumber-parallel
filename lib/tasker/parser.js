'use strict';
var log = require('debug')('cucumber-parallel:parser');
var Gherkin = require('gherkin');
var fs = require('fs');

function parser(feature) {

    var _this = {};
    var parser = new Gherkin.Parser(new Gherkin.AstBuilder());
    parser.stopAtFirstError = false;
    var matcher = new Gherkin.TokenMatcher();
    var scanner = new Gherkin.TokenScanner(fs.readFileSync(feature, 'UTF-8'));

    try {
        _this.feature = parser.parse(scanner, matcher);
        _this.isSucceeded = true;
    } catch (e) {
        log('error in parsing feature ', feature);
        _this.isSucceeded = false;
    }

    return _this;
}

module.exports =  parser;