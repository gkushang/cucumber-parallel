# cucumber-parallel

[![NPM](https://nodei.co/npm/cucumber-parallel.png?stars&downloads)](https://nodei.co/npm/cucumber-parallel/)

### Run Cucumber features in Parallel
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

#### Format
Because it runs features in parallel, it only supports JSON format. You can save the JSON output as a single result file by passing the format as,

```bash
-f json:path/to/file.json
```

### Run

Supports all the arguments as `cucumber`

``` bash
$ node_modules/cucumber-js-parallel/bin/cucumber-parallel /path/to/features -r /path/to/step-defs -f json:path/to/file --tags=@myTag 
```


