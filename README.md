# cucumber-parallel

[![NPM](https://nodei.co/npm/cucumber-parallel.png?stars&downloads)](https://nodei.co/npm/cucumber-parallel/)

### Run Cucumber Features and Scenarios in Parallel
###### Supports Cucumber@0.8.0 and higher


### Install

``` bash
npm install cucumber-parallel
```

Add dependency to your package.json

``` json
{
  "devDependencies" : {
    "cucumber-parallel": "latest"
  }
}
```

#### How to run Features/Scenarios in Parallel?

`Parallel Types: ['scenarios', 'features']`

To run `Scenarios` in Parallel, pass process.argv `--parallel scenarios`

``` bash
$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/features -r /path/to/step-defs --parallel scenarios -f json:path/to/file
```

It runs `Featues` in parallel by default, or by passing `--parallel features` process argument

``` bash
$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/features -r /path/to/step-defs -f json:path/to/file
```

#### Format
Because it runs features/scenarios in parallel, it only supports JSON format. You can save the JSON output to file by passing the cucumber-format as,

```bash
-f json:path/to/file.json
```

### Run

Supports all the arguments as `cucumber`

``` bash
$ node_modules/cucumber-parallel/bin/cucumber-parallel /path/to/features -r /path/to/step-defs -f json:path/to/file --tags=@myTag 
```

### Upcoming Enhancments
- Run Features Parallel   : LIVE
- Run Scenarios Parallel  : LIVE
- Run Tags Parallel       : WIP



