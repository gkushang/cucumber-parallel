'use strict';
var log = require('debug')('cucumber-parallel:tasks');
var Parser = require('./parser');
var Finder = require('fs-finder');
var ParallelTypes = require('./parallelTypes');

module.exports = function tasks() {

    var scenarios = [];
    var parallelType = ParallelTypes.FEATURES;

    function processScenarios(options) {
        function scenarioAsString(scenario) {
            return options.featureFilePath + ':' + scenario.location.line;
        }

        options.feature.scenarioDefinitions.forEach(function(scenario) {
            if (scenario.examples) {
                scenario.examples.forEach(function(example) {
                    example.tableBody.forEach(function(tableRow) {
                        scenarios.push(scenarioAsString(tableRow));
                    });
                });
            } else {
                scenarios.push(scenarioAsString(scenario));
            }
        });
    }

    function getParallelType() {
        return parallelType;
    }

    function getFeatures(fromDirectory, parallelRunType) {
        if (parallelRunType) {
            log('run parallel ' + parallelRunType);
            parallelType = parallelRunType;
        }

        var features = Finder.from(fromDirectory).findFiles('*.feature');
        log('features found ', features);
        return features;
    }

    function getScenarios(fromDirectory, parallelRunType) {
        if (parallelRunType) {
            log('run parallel ' + parallelRunType);
            parallelType = parallelRunType;
        }

        getFeatures(fromDirectory).forEach(function(featureFilePath) {
            var parser = Parser(featureFilePath);
            if (parser.isSucceeded) {
                processScenarios({
                    featureFilePath: featureFilePath,
                    feature: parser.feature
                });
            }
        });

        return scenarios;
    }

    function isRerunFeaturesPassed(cucumberProgram) {
        var rerun = cucumberProgram.rerun;
        return rerun && rerun instanceof Array && rerun.length > 0;
    }

    function getTasks(featuresOrDirectoryPath, cucumberProgram) {
        parallelType = cucumberProgram.parallel[0];

        if (isRerunFeaturesPassed(cucumberProgram)) return featuresOrDirectoryPath;

        var fromDirectory = featuresOrDirectoryPath[0];

        return parallelType && typeof parallelType === 'string' && parallelType.toLowerCase() === ParallelTypes.SCENARIOS
            ? getScenarios(fromDirectory, ParallelTypes.SCENARIOS)
            : getFeatures(fromDirectory, ParallelTypes.FEATURES);
    }

    return {
        getTasks: getTasks,
        getParallelType: getParallelType
    }
};
