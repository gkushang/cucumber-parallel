'use strict';
var log = require('debug')('cucumber-parallel:reporter');
var fs = require('fs');

module.exports = function reporter() {

    var json = [];
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
            json.push(message.report[0]);
        }
        overallResult(message);
    }

    function formatterOutputFile(message) {
        var parts = message.format.split(':');
        if(!outputToFile) {
            outputToFile = parts[1] || '';
        }
    }

    function getResults() {
        return result;
    }

    function report() {
        var jsonFormatted = '[' + json.join(',') + ']\n';
        log(jsonFormatted);
        if (outputToFile.length > 0) {
            try {
                fs.writeFileSync(outputToFile, jsonFormatted, 'utf8');
                log('Json output written to ' + outputToFile);
            }catch(e) {
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