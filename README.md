Cucumber Parallel
=================
***Run Cucumber Features and Scenarios in Parallel***

[![Build Status][travis-shield]][travis-link] [![npm][npm-shield]][npm-link] [![Dependency Status][depedency-shield]][depedency-link] [![License][license-shield]][license-link]

> For HTML Reporting, head over to [cucumber-html-reporter][cucumber-html-reporter]

## Install


``` bash
npm install cucumber-parallel --save-dev
```
***Notes:*** 

* Latest version supports Cucumber 2
* Install `cucumber-parallel@1.0.0` for cucumber version `< Cucumber@2`


## Very simple to use


```bash
--parallel ::parallelTypes::

parallelTypes: ['scenarios', 'features']

```


To run `Scenarios` in Parallel, pass process.argv `--parallel scenarios`


``` bash
$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/features -r /path/to/step-defs --parallel scenarios -f json:path/to/file.json
```


It runs `Features` in parallel by default, or by passing `--parallel features` process argument


``` bash
$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/features -r /path/to/step-defs -f json:path/to/file.json
```



## Format
Because it runs features/scenarios in parallel, it only supports JSON format. You can save the JSON output to file by passing the cucumber-format as,


```bash
-f json:path/to/file.json
```



## Run

Supports all the arguments as [cucumber-js][1], except `--format` as explained above

``` bash
$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/features -r /path/to/step-defs -f json:path/to/file.json --tags=@myTag 
```

## Re-run failed scenarios in parallel

```bash

$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/eachFeatureSeperatedBySpaceWithScenarioLine -r /path/to/step-defs -f json:path/to/file.json --tags=@myTag

```

`/path/to/eachFeatureSeperatedBySpace` : path/to/feature:scenarioLine path/to/feature:scenarioLine

E.g. 

```bash

$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/login.feature:10:20:25 path/to/signup.feature:18 -r /path/to/step-defs -f json:path/to/file.json --tags=@myTag

```

Above example will run login & signup features in parallel; two processes in parallel since two features are passed. Total 4 scenarios will run. You can run all 4 in parallel by passing as below,

`/path/to/login.feature:10 /path/to/login.feature:20 /path/to/login.feature:25 path/to/signup.feature:18`


### HTML Reports

Run Features or Scenarios in Parallel and generate HTML Reports with [cucumber-html-reporter][cucumber-html-reporter]

Cucumber-Parallel is also integrated with HTML reporting Grunt Cucumber module [grunt-cucumberjs][2]

Sample HTML Reports:

1. [Bootstrap Theme Reports with Pie Chart][3]
2. [Foundation Theme Reports][4]
3. [Simple Theme Reports][5]

## Changelog 

[changelog][changelog]


[1]: https://github.com/cucumber/cucumber-js "CucumberJs"
[2]: https://www.npmjs.com/package/grunt-cucumberjs "grunt-cucummberjs"
[3]: http://htmlpreview.github.io/?https://github.com/gkushang/cucumber-html-reporter/blob/develop/samples/html_reports/cucumber_report_bootstrap.html "Bootstrap Theme Reports"
[4]: http://htmlpreview.github.io/?https://github.com/gkushang/cucumber-html-reporter/blob/develop/samples/html_reports/cucumber_report_foundation.html "Foundation Theme Reports"
[5]: http://htmlpreview.github.io/?https://github.com/gkushang/cucumber-html-reporter/blob/develop/samples/html_reports/cucumber_report_simple.html "Simple Theme Reports"

[cucumber-html-reporter]: https://www.npmjs.com/package/cucumber-html-reporter

[changelog]: https://github.com/gkushang/cucumber-parallel/blob/develop/CHANGELOG.md

[travis-shield]: https://travis-ci.org/gkushang/cucumber-parallel.svg?branch=develop
[travis-link]: https://travis-ci.org/gkushang/cucumber-parallel

[npm-shield]: https://img.shields.io/npm/v/cucumber-parallel.svg
[npm-link]: https://www.npmjs.com/package/cucumber-parallel

[depedency-shield]: https://david-dm.org/gkushang/cucumber-parallel.svg
[depedency-link]: https://david-dm.org/gkushang/cucumber-parallel

[license-shield]: https://img.shields.io/github/license/mashape/apistatus.svg
[license-link]: https://github.com/gkushang/cucumber-parallel/






