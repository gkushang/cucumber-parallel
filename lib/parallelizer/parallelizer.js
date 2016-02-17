'use strict';
var cucumber_js = require('./../cucumber/cucumber_js');
var log = require('debug')('cucumber-parallel:parallelizer');
var Events = require('events');
var Tasks = require('./../tasker/tasks')();
var ChildProcess = require('child_process');
var Reporter = require('./reporter')();
var path = require('path');
var fs = require('fs');

module.exports = function() {

    var cucumberProgram;
    var cucumberJs;
    var tasks;
    var _argv;
    var index = 0;
    var report = [];
    var runnerIndex = 0;

    var eventEmitter = new Events.EventEmitter();

    eventEmitter.on('run', function() {
        log('run');
        runnerIndex++;
        forkRunner({feature: tasks.shift()});
        eventEmitter.emit('next');
    });

    eventEmitter.on('next', function() {
        log('next');
        if (tasks.length > 0) {
            eventEmitter.emit('run');
        }
    });

    eventEmitter.on('invoke', function() {
        log('invoke');
        eventEmitter.emit('initialize');
    });

    eventEmitter.on('initialize', function() {
        log('initialize');
        cucumberProgram = cucumberJs.getProgram();
        cucumberProgram.parse(_argv);
        tasks = Tasks.getTasks(cucumberProgram.args[0], 'scenario');
        eventEmitter.emit('run');
    });

    process.on('exit', function() {
        log('exit');
        log('isSucceeded: ', Reporter.getResults().succeeded);
        process.exit(Reporter.getResults().code);
    });

    function done() {
        if (runnerIndex === 0) {
            Reporter.report();
            process.send('exit');
        }
    }

    function forkRunner(options) {
        var runner;

        _argv.push(options.feature);

        if (options.feature.length > 0) {
            runner = ChildProcess.fork(path.join(__dirname, '../../lib/parallelizer/runner'), _argv);
        }

        log('runner ', index++);

        runner.on('message', function(message) {
            if (message.info === 'report') {
                log('report');
                Reporter.inform(message);
                runnerIndex--;
                done();
            }
        });

        runner.on('message', function(message) {
            if (message.info === 'formatter') {
                log('format');
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