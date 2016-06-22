'use strict';
var fs = require('fs');
var chai = require('chai');
chai.use(require('chai-fs'));
var expect = chai.expect;
var config = require('../../config/config.json');

module.exports = {

    assert: function() {
        var cucumberReportJson = 'cucumber_report.json';
        var jsonFile = 'test/report/' + cucumberReportJson;

        function assertJsonContents() {
            var jsonOutput = require('../../report/' + cucumberReportJson);
            var jsonOutputStringify = JSON.stringify(jsonOutput);

            //verify number of scenarios
            var numberOfScenarios = 0;
            jsonOutput.forEach(function(feature) {
                numberOfScenarios += feature.elements.length;
            });

            expect(numberOfScenarios).to.be.equal(config.Scenarios.totalScenarios, 'Scenarios are missing in the report');

            // verify screenshot is attached to the report
            expect(jsonOutputStringify).to.contain('mime_type":"image/png"', 'screenshot was not attached to report');
            
            // verify test data is attached to the report
            expect(jsonOutputStringify).to.contain('mime_type":"text/plain"', 'test data was not attached to report');
            
            // verify data-table is attached to the report
            expect(jsonOutputStringify).to.contain('rows', 'data-table rows was not attached to report');
            expect(jsonOutputStringify).to.contain('cells', 'data-table rows was not attached to report');
        }

        expect(jsonFile).to.be.a.file('expected a file to be Json').with.json;

        return assertJsonContents();
    }
};