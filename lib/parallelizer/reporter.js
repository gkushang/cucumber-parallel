'use strict';
var log = require('debug')('cucumber-parallel:report');
var fs = require('fs');
var Promise = require('bluebird');
var findIndex = require('lodash').findIndex;
var colors = require('colors');

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
            featureResults.push(message.report[0]);
            overallResult(message);
        }
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

    function processResults() {
        return new Promise(function(resolve, reject) {
            var results = [];

            featureResults.forEach(function(feature) {
                try {
                    var existingResult = JSON.parse(feature);

                    var index = findIndex(results, function(result) {
                        return result.uri === existingResult.uri;
                    });

                    if (index !== -1) {
                        if (results[index].elements && results[index].elements.length > 0 &&
                            existingResult.elements && existingResult.elements.length > 0) {
                            results[index].elements.push(existingResult.elements[0]);
                        }
                    } else {
                        results.push(existingResult);
                    }
                } catch (e) {
                    reject(e);
                }
            });
            resolve(results);
        })
    }

    function report() {
        return new Promise(function(resolve, reject) {
            function done(results) {
                var jsonFormatted = JSON.stringify(results, null, 2);
                log(jsonFormatted);
                if (outputToFile.length > 0) {
                    try {
                        fs.writeFileSync(outputToFile, jsonFormatted, 'utf8');
                        console.log('Json output written to ' + outputToFile.cyan);
                    } catch (e) {
                        console.log('Error writing Json output to ' + outputToFile.red);
                    }
                } else {
                    console.log('Results are not written to any file because output file was not provided'.red);
                    console.log('Output file can be provided with the format, e.g. \"-f json:path/to/file.json\"'.cyan);
                }

                return resolve('done');
            }

            return processResults()
                .then(done)
                .catch(function(e) {
                    return reject(e);
                })
        });
    }

    return {
        inform: inform,
        report: report,
        getResults: getResults,
        formatterOutputFile: formatterOutputFile
    }
};