'use strict';

var fs = require('fs');
var npm = require('npm');
var path = require('path');
var which = require('which');
var findup = require('findup');
var type = require('utils-type');
var findupSync = require('findup-sync');

exports = module.exports = whech;
exports.sync = whechSync;
exports.packageFields = ['version'];

var argv = process.argv;

function whech(env_, cb){
  var env = check(env_);
  which(env.name, function(err, whichName){
    npm.load(function(cli, npm_){
      env.localDir = npm_.dir;
      env.globalDir = npm_.globalDir;
      env.which = err || whichName;
      whechCommon(env);
      findup(env.cwd, env.configFile, function(err, configDir){
        env.configFile = err || path.join(configDir, env.configFile);
        cb(err, env);
      });
    });
  });
}

function whechSync(env_){
  var env = check(env_);
  whechCommon(env);
  var configFile = env.configFile;
  env.configFile = findupSync(configFile, { cwd : env.cwd })
    || new Error('configFile `'+configFile+'` not found in `'+env.cwd+'`');
  return env;
}

function whechCommon(env){
  env.cwd = env.cwd || process.cwd();
  env.which = env.which || which.sync(env.name);
  env.configFile = type(env.configFile).string || env.name + 'file';

  if( !(env.runFromBin = argv.indexOf(env.which) > -1) ){
    env.configFile = path.basename(argv[1]);
    env.cwd = path.resolve(env.cwd, path.dirname(argv[1]));
  }
  if( !path.extname(env.configFile) ){
    env.configFile = path.basename(env.configFile + (env.extension || '.js'));
  }

  env.localDir = env.localDir || '';
  try {  env.localDir = require.resolve(env.name).replace(new RegExp(env.name+'.*'), '');  }
    catch(err){ env.moduleDir = err; }

  env.globalDir = env.globalDir || '';
  try { env.globalDir = require.resolve(env.which).replace(new RegExp(env.name+'.*'), '');  }
    catch(err){ env.globalDir = err; }

  var globalPackage, localPackage;
  var packagePath = path.join(env.name, 'package');

  env.localPackage = { };
  try {  localPackage = require(path.join(env.localDir, packagePath));  }
    catch(err){ env.localPackage = err;  }

  env.globalPackage = { };
  try {  globalPackage = require(path.join(env.globalDir, packagePath));  }
    catch(err){  env.globalPackage = err;  }

  copyFields(env, localPackage, globalPackage);
}

function check(env_){
  var env = type(env_);
  if( !env.match(/string|plainObject/) ){
    throw new TypeError('`env` should  be string or object');
  }
  env = env.plainObject || { name : env.string };
  if( !type(env.name).string ){
    throw new TypeError('give a `env.name` that is a string');
  }
  env.name = env.name.toLowerCase();
  return env;
}

function copyFields(env, localPackage, globalPackage){
  exports.packageFields.forEach(function(field){
    env.globalPackage[field] = globalPackage && globalPackage[field];
    env.localPackage[field] = localPackage && localPackage[field];
  });
}
