# whech [![build][b-build]][x-travis][![NPM version][b-version]][m-whech]

[install](#install) -
[documentation](#documentation) -
[license](#license)


[which][m-which] the heck directions for
- Was the script run from a bin?
- There is some config file asociated to it?
- What is the main or/and global `node_modules`directory?
- Get me some fields of their the local and global packages

## usage

```javascript
var whech = require('whech');

whech.ext = '.js';

whech('which', function(err, spec){
  if(err) throw err;
  console.log(spec);
  // =>
  // { name: 'which',
  //   which: '/usr/bin/which',
  //   runFromBin: false,
  //   configFile: [Error: not found],
  //   localDir: '/home/jcm/code/whech/node_modules',
  //   globalDir: '/home/jcm/npm/lib/node_modules',
  //   globalPackage: { [Error: Cannot find module] code: 'MODULE_NOT_FOUND' },
  //   localPackage: { version: '1.0.5' } }
});
```


### documentation

The `module.exports` a function
```js
var whech = require('whech')
```
which is asynchronous. To use the `sync` version take `whech.sync`.

### whech
```js
function whech(string|object spec, function callback)
```

_arguments_
 - `spec` type string or object with a name property that is a string
 - `callback` type function to be called with the last `error` and `spec`

Errors are attached to `spec` a property instead of throwing.

_spec properties_
 - `ext` type string, the extension of the configFile
 - `name` type string the name given as a string or object property
 - [`which`][m-which] type string first instance of an executable in the PATH
 - `runFromBin` type boolean, wether or not `process.argv` contains `which`
 - `configFile` type string, `configFile` if given
 - `localDir` type string, the global dir where node_modules are installed
 - `globalDir`: type string, the local dir where node_modules are installed
 - `localPackage`: `require(path.join(name, 'package'))`
 - `globalPackage`: `require(path.join(localDir, name, 'package'))`

_defaults_
 - `configfile` will default to `name + 'file' + (spec.ext || '.js')`

### whech.sync

```js
function whechSync(string|object spec)
```

_arguments_
 - `spec`, type string|object, the same as the async version

_returns_
 - `spec` with same properties listed above

## install

With [npm][x-npm]

```js
 npm install whech
```

### test

```js
npm test
```

### todo

 - [ ] More tests
 - [ ] Review and see if there is something missing

### license

[![LICENSE](http://img.shields.io/npm/l/whech.svg?style=flat-square)](
  http://opensource.org/licenses/MIT
)

[m-which]: http://www.npmjs.com/which
[m-whech]: http://www.npmjs.com/whech

[x-npm]: http://www.npmjs.com
[x-travis]: https://travis-ci.org/stringparser/node-whech/builds
[x-license]: http://opensource.org/licenses/MIT

[b-build]: http://img.shields.io/travis/stringparser/node-whech/master.svg?style=flat-square
[b-gitter]: https://badges.gitter.im/Join%20Chat.svg
[b-version]: http://img.shields.io/npm/v/whech.svg?style=flat-square
