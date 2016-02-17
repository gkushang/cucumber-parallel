'use strict';
var log = require('debug')('cucumber-parallel:reporter');
var fs = require('fs');

module.exports = function reporter() {

    var featureResults = [];
    var outputToFile;
    var result = {
        succeeded: true,
        code: 0
    };

    function overallResult(message) {
        if (result.succeeded) {
            result = message;
        }
    }

    function inform(message) {


        if (message.report[0].length > 1) {

            var currentFeatureResult = JSON.parse(message.report[0]);

            if (featureResults.length > 0) {
                log('JSON URI: ', featureResults[0].uri);
                var isAdded = false;
                featureResults.forEach(function(featureResult) {
                    if (featureResult.uri === currentFeatureResult.uri) {
                        isAdded = true;
                        return featureResult.elements.push(currentFeatureResult.elements[0])
                    }
                });

                if(!isAdded) {
                    featureResults.push(currentFeatureResult);
                }
            } else {
                featureResults.push(currentFeatureResult);
            }
        }

        overallResult(message);
    }

    function formatterOutputFile(message) {
        var parts = message.format.split(':');
        if (!outputToFile) {
            outputToFile = parts[1] || '';
        }
    }

    function getResults() {
        return result;
    }

    function report() {
        featureResults = JSON.stringify(featureResults);
        log('JSON.stringify(json) ' + featureResults);

        var jsonFormatted = featureResults;
        log(jsonFormatted);
        if (outputToFile.length > 0) {
            try {
                fs.writeFileSync(outputToFile, jsonFormatted, 'utf8');
                log('Json output written to ' + outputToFile);
            } catch (e) {
                log('Error writing Json output to ' + outputToFile);
            }
        }
    }

    return {
        inform: inform,
        report: report,
        getResults: getResults,
        formatterOutputFile: formatterOutputFile
    }
};