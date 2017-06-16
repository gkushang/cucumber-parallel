'use strict';
var htmlReporter = require('cucumber-html-reporter');
var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Before, registerHandler, Given, Then, When}) {
    Before(function(scenario, callback) {
        this.scenario = scenario;
        callback();
    });

    Given(/^Fred has multiple (?:features|scenarios) written in cucumber$/, function (callback) {
        this.attach('', 'image/png');
        callback();
    });

    When(/^he runs the features in parallel with "([^"]*)" using cucumber\-parallel module$/, function (testData, callback) {
        this.attach(testData);
        callback();
    });

    Then(/^all the (?:features|scenarios) should run in parallel$/, function (callback) {
        callback();
    });

    When(/^Fred has scenario outline with the "([^"]*)"$/, function (id, callback) {
        callback();
    });

    Given(/^Fred has a step with below data table$/, function (table, callback) {
        callback();
    });
});
