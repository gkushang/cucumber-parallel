'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

var log = require('debug')('cucumber-parallel:cucumber_js');
var Cucumber = require('cucumber');
var Cli = require('cucumber').Cli;
var ScenarioFilter = require('cucumber').ScenarioFilter;
var helpers = require('../../node_modules/cucumber/lib/cli/helpers');

var runTime = _interopRequireDefault(require('cucumber').Runtime);
var path = require('path');
var Command = require('commander').Command;
var fs = require('fs');
var slicedToArray = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray'));
var bluebird = _interopRequireDefault(require('bluebird'));


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

        program.on('--help', function () {
            console.log('  For more details please visit https://github.com/cucumber/cucumber-js#cli\n');
        });

        program.parse(process.argv);

        return program;
    }

    function reportFormatterOutputFile(formats) {
        formats.forEach(function (format) {
            process.send({
                info: 'formatter',
                format: format
            });
        })
    }

    function exit(isSucceed) {
        var code = isSucceed ? 0 : 1;

        process.send({
            info: 'report',
            report: report,
            succeeded: isSucceed,
            code: code
        });

        function exitNow() {
            log('exiting with code: ' + code);
            process.exit(code);
        }

        function exitAfterTimeOut() {
            setTimeout(exitNow, 10000);
        }

        if (process.stdout.write('')) {
            exitAfterTimeOut();
        } else {
            process.stdout.on('drain', exitAfterTimeOut);
        }
    }

    function run(obj) {
        return function (options) {

            var ref = (0, slicedToArray.default)(options, 2);
            var features = ref[0];
            var ref$ = ref[1];
            var cleanup = ref$.cleanup;
            var formatters = ref$.formatters;

            var JsonFormatter = formatters[1];

            JsonFormatter.log = function (value) {
                report.push(value.slice(1, -1));
            };

            var runtime = new runTime.default({
                features: features,
                listeners: formatters,
                options: getProgram().opts(),
                supportCodeLibrary: obj.supportCodeLibrary
            });

            var isSucceed = runtime.start();

            cleanup();

            return isSucceed;
        }
    }

    function applyConfigurationAndRun(cli) {

        return function (configuration) {

            reportFormatterOutputFile(getProgram().opts().format);

            var scenarioFilter = new ScenarioFilter(configuration.scenarioFilterOptions);

            var supportCodeLibrary = cli.getSupportCodeLibrary(configuration.supportCodePaths);

            var formatters = cli.getFormatters({
                formatOptions: configuration.formatOptions,
                formats: configuration.formats,
                supportCodeLibrary: supportCodeLibrary
            });

            var _ref8 = bluebird.default.all([(0, helpers.getFeatures)({
                featurePaths: configuration.featurePaths,
                scenarioFilter: scenarioFilter
            }), formatters]);

            return _ref8.then(run({supportCodeLibrary: supportCodeLibrary}))
        }
    }

    function runCucumber() {
        function removeNodeArgFromProcessArgs() {
            if (process.argv[2].match('node')) {
                process.argv.splice(2, 1);
                process.argv.splice(2, 1);
            }
        }

        removeNodeArgFromProcessArgs();

        var cwd = process.cwd();
        var argv = process.argv;
        var stdout = process.stdout;

        var cli = new Cli({
            argv: argv,
            cwd: cwd,
            stdout: stdout
        });

        return cli.getConfiguration()
            .then(applyConfigurationAndRun(cli))
            .then(exit);
    }

    return {
        getProgram: getProgram,
        runCucumber: runCucumber
    }
};
