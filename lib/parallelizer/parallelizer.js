'use strict';
var cucumber_js = require('./../cucumber/cucumber_js');
var log = require('debug')('cucumber-parallel:parallelizer');
var Events = require('events');
var Tasks = require('./../tasker/tasks')();
var ChildProcess = require('child_process');
var Reporter = require('./reporter')();
var path = require('path');
var fs = require('fs');
var colors = require('colors');

module.exports = function() {

    var cucumberProgram;
    var cucumberJs;
    var tasks;
    var _argv;
    var index = 0;
    var runnerIndex = 0;

    var eventEmitter = new Events.EventEmitter();

    eventEmitter.on('run', function() {
        runnerIndex++;
        forkRunner({feature: tasks.shift()});
        eventEmitter.emit('next');
    });

    eventEmitter.on('next', function() {
        if (tasks.length > 0) {
            eventEmitter.emit('run');
        }
    });

    eventEmitter.on('invoke', function() {
        eventEmitter.emit('initialize');
    });

    eventEmitter.on('report', function(message) {
        Reporter.inform(message);
    });

    eventEmitter.on('initialize', function() {
        cucumberProgram = cucumberJs.getProgram();
        cucumberProgram.parse(_argv);
        tasks = Tasks.getTasks(cucumberProgram.args[0], cucumberProgram.opts().parallel[0]);
        eventEmitter.emit('run');
    });

    function exit() {
        if(Reporter.getResults().succeeded) {
            console.log('\nDone, all scenarios passed without error\n'.bold.green);
        } else {
            console.log('\nFailed scenarios, please see the report\n'.bold.red);
        }
        process.exit(Reporter.getResults().code);
    }

    function done() {
        if (runnerIndex === 0) {
            Reporter.report().then(function() {
                exit();
            })
        }
    }

    function forkRunner(options) {
        var runner;

        _argv.push(options.feature);

        if (options.feature.length > 0) {
            runner = ChildProcess.fork(path.join(__dirname, '../../lib/parallelizer/runner'), _argv);
        }

        log('starting runner ', index++);

        runner.on('message', function(message) {

            if (message.info === 'report') {
                runnerIndex--;
                Reporter.inform(message);
                done();
            }

            if (message.info === 'formatter') {
                Reporter.formatterOutputFile(message);
            }
        });
    }

    function invoke(argv) {
        _argv = argv;
        cucumberJs = cucumber_js();
        eventEmitter.emit('invoke');
    }

    return {
        invoke: invoke
    }
};