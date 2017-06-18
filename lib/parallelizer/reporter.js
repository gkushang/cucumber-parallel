'use strict';
var log = require('debug')('cucumber-parallel:report');
var fs = require('fs');
var Promise = require('bluebird');
var findIndex = require('lodash.findindex');
var colors = require('colors');
var ParallelTypes = require('../tasker/parallelTypes');

module.exports = function reporter() {

    var featureResults = [];
    var outputToFile;
    var CUCUMBER_PARALLEL = '[cucumber-parallel] ';
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

    function processResults(parallelType) {
        return new Promise(function (resolve, reject) {
            var finalResults = [];

            featureResults.forEach(function (feature) {
                try {
                    var existingResult = feature;

                    if (parallelType === ParallelTypes.SCENARIOS) {

                        var existingResultObject = JSON.parse(existingResult);

                        var index = findIndex(finalResults, function (result) {
                            return result.uri === existingResultObject.uri;
                        });

                        if (index !== -1) {
                            var finalResultsIndexedObject = JSON.parse(finalResults[index]);

                            if (existingResultObject.elements && existingResultObject.elements.length > 0) {
                                if (finalResultsIndexedObject.elements) {
                                    finalResultsIndexedObject.elements.push(existingResultObject.elements);
                                } else {
                                    finalResultsIndexedObject.elements = existingResultObject.elements;
                                }

                                finalResults[index] = finalResultsIndexedObject;
                            }

                        } else {
                            finalResults.push(existingResult);
                        }

                    } else {
                        finalResults.push(existingResult);
                    }

                } catch (e) {
                    return reject(e);
                }
            });

            return resolve(finalResults);
        })
    }

    function report(parallelType) {
        return new Promise(function (resolve, reject) {
            function rejectPromise(e) {
                return reject(e);
            }

            function done(results) {
                var jsonFormatted = '[' + results + ']';
                log(jsonFormatted);
                if (outputToFile.length > 0) {
                    try {
                        fs.writeFileSync(outputToFile, jsonFormatted, 'utf8');
                        console.log(CUCUMBER_PARALLEL + 'Json output written to ' + outputToFile.cyan);
                    } catch (e) {
                        console.log(CUCUMBER_PARALLEL + 'Error writing Json output to ' + outputToFile.red);
                    }
                } else {
                    console.log(CUCUMBER_PARALLEL + 'Results are not written to any file because output file was not provided'.red);
                    console.log(CUCUMBER_PARALLEL + 'Output file can be provided with the format, e.g. \"-f json:path/to/file.json\"'.cyan);
                }

                return resolve('done');
            }

            return processResults(parallelType)
                .then(done)
                .catch(rejectPromise);
        });
    }

    return {
        inform: inform,
        report: report,
        getResults: getResults,
        formatterOutputFile: formatterOutputFile,
        CUCUMBER_PARALLEL: CUCUMBER_PARALLEL
    }
};
