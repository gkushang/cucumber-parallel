'use strict';
var htmlReporter = require('cucumber-html-reporter');

module.exports = function parallelStepDefs() {
    this.Before(function(scenario, callback) {
        this.scenario = scenario;
        callback();
    });

    this.Given(/^Fred has multiple (?:features|scenarios) written in cucumber$/, function (callback) {
        this.scenario.attach(new Buffer('').toString('base64'), 'image/png');
        callback();
    });

    this.When(/^he runs the features in parallel with "([^"]*)" using cucumber\-parallel module$/, function (testData, callback) {
        this.scenario.attach(testData);
        callback();
    });

    this.Then(/^all the (?:features|scenarios) should run in parallel$/, function (callback) {
        callback();
    });

    this.When(/^Fred has scenario outline with the "([^"]*)"$/, function (id, callback) {
        callback();
    });

    this.Given(/^Fred has a step with below data table$/, function (table, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback();
    });

    this.registerHandler('AfterFeatures', function(event, callback) {
        htmlReporter.generate({
            theme: 'bootstrap',
            jsonFile: 'test/report/cucumber_report.json',
            output: 'test/report/cucumber_report.html',
            reportSuiteAsScenarios: true
        });
        callback();
    });

};
