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

whech.packageFields = ['version'];

whech('which', function(err, env){
  if(err) throw err;
  console.log(env);
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
 - `spec` type string|object, when string becomens `spec.name`
 - `callback` function to called with the last error if there was one

Errors are attached to `spec` properties instead of throwing.

_spec properties_
 - `name`: the name given as a string or object property
 - [`which`][m-which]: first instance of an executable in the PATH
 - `runFromBin`: wether or not `process.argv` contains `which`
 - `configFile`: `configFile` if given, or `name` + file + '.js'.
 - `localDir`: if wasn't given, the global dir where node_modules are installed
 - `globalDir`: if wasn't given, the local dir where node_modules are installed
 - `localPackage`: `require(path.join(name, 'package'))`
 - `globalPackage`: `require(path.join(localDir, name, 'package'))`

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
