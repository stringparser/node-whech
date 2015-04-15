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
    throw new TypeError('`o.name` should be  non emtpy string');
  }
  return env;
}

// asynchronous version
//
function whech(name, cb){
  var o = getSpec(name);
  which(o.name, function(err, binPath){
    o.which = err || binPath; whechCommon(o);
    findup(o.cwd, o.configFile, function(err, configDir){
      o.configFile = err || path.join(configDir, o.configFile);
      cb(err, o);
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
function whechCommon(o){
  o.cwd = o.cwd || process.cwd();
  o.configFile = o.configFile || o.name + 'file';

  try {
    o.which = o.which || which.sync(o.name);
  } catch(err){ o.which = err; }

  var argv = process.argv;
  if(argv[1] && !(o.runFromBin = argv.indexOf(o.which) > -1)){
    o.configFile = path.basename(argv[1]);
    o.cwd = path.resolve(o.cwd, path.dirname(argv[1]));
  }

  if(!path.extname(o.configFile)){
    o.configFile = path.basename(
      o.configFile + (exports.extension || '.js')
    );
  }

  var nameRE = new RegExp(o.name+'.*');

  try {
    o.globalDir = o.globalDir || require.resolve(o.which).replace(nameRE, '');
  } catch(err){ o.globalDir = err; }

  try {
    o.localDir = o.localDir || require.resolve(o.name).replace(nameRE, '');
  } catch(err){ o.localDir = err; }

  var packagePath = path.join(o.name, 'package');

  try {
    o.localPackage = require(packagePath);
  } catch(err){ o.localPackage = err;  }

  try {
    o.globalPackage = require(path.join(o.globalDir, packagePath));
  } catch(err){ o.globalPackage = err; }

  return o;
}
