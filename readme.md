# whech [<img alt="progressed.io" src="http://progressed.io/bar/50" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/whech/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/whech/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/whech.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/whech)

<br>
Was the script run from a bin? <br>
What is the main `node_modules`directory?<br>
There is some config file asociated to it?<br>
What is the global `node_modules` directory?<br>

## install

    $ npm install --save whech

## usage 

```javascript
var whech = require('whech');

whech.packageFields = ['version'];

whech('which', function(err, cmd){
  if(err) throw err;
  console.log(cmd);
  // =>
  // { name: 'which',
  //   extension: '.js',
  //   which: '/usr/bin/which',
  //   runFromBin: false,
  //   configFile: [Error: not found],
  //   mainDir: '/home/jcm/code/whech/node_modules',
  //   globalDir: '/home/jcm/npm/lib/node_modules',
  //   cliPackage: { [Error: Cannot find module] code: 'MODULE_NOT_FOUND' },
  //   modulePackage: { version: '1.0.5' } }
});
```


### documentation

`whech(spec, callback)`

The function returned by the package is asynchronous. To use the `sync` version do `whench.sync`

#### spec 
type `string` or `object`

when the spec is  a string it becomnes cmd.name
when spec is an object overrides the properties of the return cmd

#### callback(err, cmd)

The callback is called when all is done with the last error in the first argument if there was one and the second the found `cmd` properties.

returns an object with the example properties

If a the property is not found an error instance will be that key value.

### test

    $ npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/whech.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
