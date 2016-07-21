cucumber-parallel
=================

[![Build Status](https://travis-ci.org/gkushang/cucumber-parallel.svg?branch=develop)](https://travis-ci.org/gkushang/cucumber-parallel) [![v](https://img.shields.io/npm/v/cucumber-parallel-blue.svg)](https://www.npmjs.com/package/cucumber-parallel)
### Run Cucumber Features and Scenarios in Parallel


### Install


``` bash
npm install cucumber-parallel --save-dev
```

#### How to run Features/Scenarios in Parallel?


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



#### Format
Because it runs features/scenarios in parallel, it only supports JSON format. You can save the JSON output to file by passing the cucumber-format as,


```bash
-f json:path/to/file.json
```



### Run

Supports all the arguments as [cucumber-js][1], except `--format` as explained above

``` bash
$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/features -r /path/to/step-defs -f json:path/to/file.json --tags=@myTag 
```


### HTML Reports

Run Features or Scenarios in Parallel and generate HTML Reports with [cucumber-html-reporter][6]

Cucumber-Parallel is also integrated with HTML reporting Grunt Cucumber module [grunt-cucumberjs][2]

Sample HTML Reports:

1. [Bootstrap Theme Reports with Pie Chart][3]
2. [Foundation Theme Reports][4]
3. [Simple Theme Reports][5]


### Proposed Enhancements
- Run Features Parallel   : LIVE
- Run Scenarios Parallel  : LIVE
- Limit number of workers : PENDING

[1]: https://github.com/cucumber/cucumber-js "CucumberJs"
[2]: https://www.npmjs.com/package/grunt-cucumberjs "grunt-cucummberjs"
[3]: http://htmlpreview.github.io/?https://github.com/gkushang/grunt-cucumberjs/blob/cucumber-reports/test/cucumber-reports/cucumber-report-bootstrap.html "Bootstrap Theme Reports"
[4]: http://htmlpreview.github.io/?https://github.com/gkushang/grunt-cucumberjs/blob/cucumber-reports/test/cucumber-reports/cucumber-report-foundation.html "Foundation Theme Reports"
[5]: http://htmlpreview.github.io/?https://github.com/gkushang/grunt-cucumberjs/blob/cucumber-reports/test/cucumber-reports/cucumber-report-simple.html "Simple Theme Reports"
[6]: https://www.npmjs.com/package/cucumber-html-reporter



