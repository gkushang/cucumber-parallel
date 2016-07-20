#!/usr/bin/env node

var cucumberJs = require('../cucumber/cucumber_js');
cucumberJs(process.argv).runCucumber();