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
        return new Promise(function(resolve, reject) {
            var results = [];

            featureResults.forEach(function(feature) {
                try {
                    var existingResult = JSON.parse(feature);
                    if (parallelType === ParallelTypes.SCENARIOS) {
                        var index = findIndex(results, function(result) {
                            return result.uri === existingResult.uri;
                        });

                        if (index !== -1) {
                            if (existingResult.elements && existingResult.elements.length > 0) {
                                if (results[index].elements) {
                                    results[index].elements.push(existingResult.elements[0]);
                                } else {
                                    results[index].elements = existingResult.elements;
                                }
                            }
                        } else {
                            results.push(existingResult);
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

    function report(parallelType) {
        return new Promise(function(resolve, reject) {
            function done(results) {
                var jsonFormatted = JSON.stringify(results, null, 2);
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
                .catch(function(e) {
                    return reject(e);
                })
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