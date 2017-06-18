var htmlReporter = require('cucumber-html-reporter');

module.exports = htmlReporter.generate({
    theme: 'bootstrap',
    jsonFile: 'test/report/cucumber_report.json',
    output: 'test/report/cucumber_report.html',
    launchReport: true,
    reportSuiteAsScenarios: true
});
