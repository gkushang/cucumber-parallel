'use strict';

var log = require('debug')('cucumber-parallel:cucumber_js');
var Cucumber = require('cucumber');
var path = require('path');
var Command = require('commander').Command;
var fs = require('fs');

module.exports = function cucumber_js() {

    var report = [];

    function getProgram() {

        function collect(val, memo) {
            memo.push(val);
            return memo;
        }

        var program = new Command(path.basename(process.argv[1]));

        program
            .usage('[options] [<DIR|FILE[:LINE]>...]')
            .version(Cucumber.VERSION, '-v, --version')
            .option('-b, --backtrace', 'show full backtrace for errors')
            .option('--compiler <EXTENSION:MODULE>', 'require files with the given EXTENSION after requiring MODULE (repeatable)', collect, [])
            .option('-d, --dry-run', 'invoke formatters without executing steps')
            .option('--fail-fast', 'abort the run on first failure')
            .option('-f, --format <TYPE[:PATH]>', 'specify the output format, optionally supply PATH to redirect formatter output (repeatable)', collect, ['pretty'])
            .option('--name <REGEXP>', 'only execute the scenarios with name matching the expression (repeatable)', collect, [])
            .option('--no-colors', 'disable colors in formatter output')
            .option('--no-snippets', 'hide step definition snippets for pending steps')
            .option('--no-source', 'hide source uris')
            .option('-p, --profile <NAME>', 'specify the profile to use (repeatable)', collect, [])
            .option('-r, --require <FILE|DIR>', 'require files before executing features (repeatable)', collect, [])
            .option('--snippet-syntax <FILE>', 'specify a custom snippet syntax')
            .option('-S, --strict', 'fail if there are any undefined or pending steps')
            .option('-t, --tags <EXPRESSION>', 'only execute the features or scenarios with tags matching the expression (repeatable)', collect, [])
            .option('--parallel <NAME>', 'run parallel scenarios or features', collect, [])
            .option('--rerun <NAME>', 'reruning the failed scenarios or features', collect, []);


        program.on('--help', function() {
            console.log('  For more details please visit https://github.com/cucumber/cucumber-js#cli\n');
        });

        return program;
    }

    function reportFormatterOutputFile(formats) {
        formats.forEach(function(format) {
            process.send({
                info: 'formatter',
                format: format
            });
        })
    }

    function runCucumber() {

        function getConfiguration() {
            if (process.argv[2].match('node')) {
                process.argv.splice(2, 1);
                process.argv.splice(2, 1);
            }

            var program = getProgram();

            program.parse(process.argv);

            var profileArgs = Cucumber.Cli.ProfilesLoader.getArgs(program.profile);

            if (profileArgs.length > 0) {
                var fullArgs = process.argv.slice(0, 2).concat(profileArgs).concat(process.argv.slice(2));
                program = getProgram();
                program.parse(fullArgs);
            }

            var features = [];
            var options = program.opts();
            features.push(process.argv[process.argv.length - 1]);
            reportFormatterOutputFile(options.format);
            return Cucumber.Cli.Configuration(options, features);
        }

        var configuration = getConfiguration();

        var runtime = Cucumber.Runtime(configuration);

        var logToFunction = function(value) {
            report.push(value.slice(1, -1));
        };

        var formatter = Cucumber.Listener.JsonFormatter(
            {
                stream: process.stdout,
                logToFunction: logToFunction
            }
        );
        runtime.attachListener(formatter);

        runtime.start(function(succeeded) {

            var code = succeeded ? 0 : 1;

            if (code === 1) {
                code = 1;
            }

            process.send({
                info: 'report',
                report: report,
                succeeded: succeeded,
                code: succeeded ? 0 : 1
            });

            function exitNow() {
                log('exiting with code: ' + code);
                process.exit(code);
            }

            function exitAfterTimeOut() {
                setTimeout(exitNow, 5000);
            }

            if (process.stdout.write('')) {
                exitAfterTimeOut();
            } else {
                process.stdout.on('drain', exitAfterTimeOut);
            }

        });
    }


    return {
        getProgram: getProgram,
        runCucumber: runCucumber
    }
};
