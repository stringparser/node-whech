# which-blib [<img alt="progressed.io" src="http://progressed.io/bar/50" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/which-blib/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/which-blib/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/which-blib.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/which-blib)

<br>
Was the script run from bin? <br>
What is the main `node_modules`directory?<br>
There is some config file asociated to it?<br>
What is the global `node_modules` directory?<br>

## install

    $ npm install --save which-blib

## usage 

```javascript
var wbl = require('which-blib');

wbl.packageFields = ['version'];

wbl('which', function(err, config){
  if(err) throw err;
  console.log(config);
  // =>
  // { name: 'which',
  //   extension: '.js',
  //   which: '/usr/bin/which',
  //   runFromBin: false,
  //   configFile: [Error: not found],
  //   mainDir: '/home/jcm/code/which-blib/node_modules',
  //   globalDir: '/home/jcm/npm/lib/node_modules',
  //   cliPackage: { [Error: Cannot find module] code: 'MODULE_NOT_FOUND' },
  //   modulePackage: { version: '1.0.5' } }
});
```

### test

    $ npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/which-blib.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
