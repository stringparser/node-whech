# whech [<img alt="progressed.io" src="http://progressed.io/bar/50" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/node-whech/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/node-whech/builds) [<img alt="NPM version" src="http://img.shields.io/npm/v/whech.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/whech)

<p align="center">which the heck directions</p>

Answering this questions:
- Was the script run from a bin?
- There is some config file asociated to it?
- What is the main or/and global `node_modules`directory?
  - If so fetch me some fields from that package

## install

    $ npm install --save whech

## usage 

```javascript
var whech = require('whech');

whech.packageFields = ['version'];

whech('which', function(err, env){
  if(err) throw err;
  console.log(env);
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

`var whech = require('whech')`

The function returned by the package is asynchronous. 
To use the `sync` version take `whech.sync`.
To specify what properties you want from the `cli` and `module` packages change
`whech.packageFields` by default `whech.packageFields = ['version']`.

### async 

`whech(spec, callback)`

#### spec 
type `string` or `object`

- If spec is  a string it becomnes `env.name` (see below).
- If spec is an object overrides the default properties of `env` (see below).

If something is not found instead of throwing an error is assigned to that `env` key value.

#### callback(err, env)

`callback` is called with the last error if there was one.

`env` properties:
 - name: the name of the spec
 - [which](https://www.npmjs.org/package/which): first instance of an executable in the PATH
 - runFromBin: wether or not `process.argv` contains `env.which`
 - configFile: `spec.configFile` if was given and if not `env.name` + `'file'` + `env.extension`.
 - mainDir: `npm.dir`
 - globalDir: `npm.globalDir`
 - cliPackage: `require(path.join(env.globalDir, env.name, 'package'))`
 - modulePackage: `require(path.join(env.mainDir, env.name, 'package'))`

### test

    $ npm test

### todo

 - [ ] Make better tests
 - [ ] Review and see if there is something missing

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/whech.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
