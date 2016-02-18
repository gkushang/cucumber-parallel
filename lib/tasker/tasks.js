'use strict';
var log = require('debug')('cucumber-parallel:tasks');
var Parser = require('./parser');
var Finder = require('fs-finder');
var TaskTypes = require('./taskTypes');

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

    function getFeatures(fromDirectory) {
        var features = Finder.from(fromDirectory).findFiles('*.feature');
        log('features found ', features);
        return features;
    }

    function getScenarios(fromDirectory) {

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

    function getTasks(fromDirectory, taskType) {
        return taskType && typeof taskType === 'string' && taskType.toLowerCase() === TaskTypes.SCENARIO
            ? getScenarios(fromDirectory)
            : getFeatures(fromDirectory);
    }

    return {
        getTasks: getTasks
    }
};