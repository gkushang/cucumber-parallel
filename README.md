cucumber-parallel
=================

[![Build Status](https://travis-ci.org/gkushang/cucumber-parallel.svg?branch=develop)](https://travis-ci.org/gkushang/cucumber-parallel)

[![NPM](https://nodei.co/npm/cucumber-parallel.png?stars&downloads)](https://nodei.co/npm/cucumber-parallel/)

### Run Cucumber Features and Scenarios in Parallel

###### Supports Cucumber@0.8.0 and higher



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



### Proposed Enhancements
- Run Features Parallel   : LIVE
- Run Scenarios Parallel  : LIVE
- Limit number of workers : PENDING

[1]: https://github.com/cucumber/cucumber-js "CucumberJs"



