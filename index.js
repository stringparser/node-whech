'use strict';

var path = require('path');
var type = require('utils-type');
var which = require('which');
var findup = require('findup');
var findupSync = require('findup-sync');

exports = module.exports = whech;

// check input and give an object with the spec
//
function getSpec(name){
  var env = type(name).plainObject || {name: name};
  if(typeof env.name !== 'string' || !env.name.trim()){
    throw new TypeError('`spec.name` should be  non emtpy string');
  }
  return env;
}

// asynchronous version
//
function whech(name, cb){
  var spec = getSpec(name);
  which(spec.name, function(err, binPath){
    spec.which = err || binPath;
    whechCommon(spec);
    findup(spec.cwd, spec.configFile, function(err, configDir){
      spec.configFile = err || path.join(configDir, spec.configFile);
      cb(err, spec);
    });
  });
}

whech.sync = function whechSync(name){
  var env = whechCommon(getSpec(name));
  env.configFile = findupSync(env.configFile, {cwd : env.cwd})
    || new Error('`'+env.configFile+'` wasn\'t found from `'+env.cwd+'`');

  return env;
};

// main operations of sync and async version
//
function whechCommon(spec){
  spec.cwd = spec.cwd || process.cwd();
  spec.configFile = spec.configFile || spec.name + 'file';

  try {
    spec.which = spec.which || which.sync(spec.name);
  } catch(err){ spec.which = err; }

  var argv = process.argv;
  if(argv[1] && !(spec.runFromBin = argv.indexOf(spec.which) > -1)){
    spec.configFile = path.basename(argv[1]);
    spec.cwd = path.resolve(spec.cwd, path.dirname(argv[1]));
  }

  if(!path.extname(spec.configFile)){
    spec.configFile = path.basename(
      spec.configFile + (exports.extension || '.js')
    );
  }

  var nameRE = new RegExp(spec.name+'.*');

  try {
    spec.globalDir = spec.globalDir
      || require.resolve(spec.which).replace(nameRE, '');
  } catch(err){ spec.globalDir = err; }

  try {
    spec.localDir = spec.localDir
      || require.resolve(spec.name).replace(nameRE, '');
  } catch(err){ spec.localDir = err; }

  var packagePath = path.join(spec.name, 'package');

  try {
    spec.localPackage = require(packagePath);
  } catch(err){ spec.localPackage = err;  }

  try {
    spec.globalPackage = require(path.join(spec.globalDir, packagePath));
  } catch(err){ spec.globalPackage = err; }

  return spec;
}
