'use strict';
var log = require('debug')('cucumber-parallel:tasks');
var Parser = require('./parser');
var Finder = require('fs-finder');
var ParallelTypes = require('./parallelTypes');

module.exports = function tasks() {

    var scenarios = [];

    function processScenarios(options) {
        function scenarioAsString(scenario) {
            return options.featureFilePath + ':' + scenario.location.line;
        }

        options.feature.scenarioDefinitions.forEach(function(scenario) {
            scenarios.push(scenarioAsString(scenario));
        });
    }

    function getFeatures(fromDirectory, parallelType) {
        if(parallelType) {
            log('run parallel ' +  parallelType);
        }
        var features = Finder.from(fromDirectory).findFiles('*.feature');
        log('features found ', features);
        return features;
    }

    function getScenarios(fromDirectory, parallelType) {
        if(parallelType) {
            log('run parallel ' + parallelType);
        }
        getFeatures(fromDirectory).forEach(function(featureFilePath) {
            var parser = Parser(featureFilePath);
            if(parser.isSucceeded) {
                processScenarios({
                    featureFilePath: featureFilePath,
                    feature: parser.feature
                });
            }
        });

        return scenarios;
    }

    function getTasks(fromDirectory, parallelType) {
        return parallelType && typeof parallelType === 'string' && parallelType.toLowerCase() === ParallelTypes.SCENARIOS
            ? getScenarios(fromDirectory, ParallelTypes.SCENARIOS)
            : getFeatures(fromDirectory, ParallelTypes.FEATURES);
    }

    return {
        getTasks: getTasks
    }
};