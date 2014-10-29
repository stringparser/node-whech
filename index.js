'use strict';

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
    env.which = err || whichName;
    npm.load(function(cli, npm_){
      whechCommon(env, npm_);
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
  env.configFile = findupSync(env.configFile, { cwd : env.cwd });
  return env;
}

function whechCommon(env, npm_){
  npm_ = npm_ || { };

  env.extension = type(env.extension).string
    || '.js';
  env.configFile = type(env.configFile).string
    || env.name + 'file';

  env.cwd = env.cwd
    || process.cwd();
  env.which = env.which
    || which.sync(env.name)
    || new Error('bin of '+env.name+' not found');
  env.runFromBin = argv.indexOf(env.which) > -1;

  if( !env.runFromBin ){
    env.cwd = path.resolve(env.cwd, path.dirname(argv[1]));
    env.configFile = path.basename(argv[1]);
  }
  if( !path.extname(env.configFile) ){
    env.configFile += env.extension;
  }

  env.mainDir = npm_.dir
    || path.join(env.cwd, 'node_modules');
  env.globalDir = npm_.globalDir
    || type(env.which).string
     ? path.resolve(env.which || '', '..', '..', 'lib', 'node_modules')
     : '';

  env.cliPackage = { };
  env.modulePackage = { };
  var pack = path.join(env.name, 'package');
  var cliPackage = path.join(env.globalDir, pack);
  var modulePackage = path.join(env.mainDir, pack);
  var errorMessage = 'could not find module '+env.name+' on ';

  try {  modulePackage = require(modulePackage);  }
    catch(err){  env.modulePackage = new Error(errorMessage + modulePackage);  }
  try {  cliPackage = require(cliPackage);  }
    catch(err){  env.cliPackage = new Error(errorMessage + cliPackage);  }

  copyFields(env, modulePackage, cliPackage);
}

function check(env){
  var envIs = type(env);
  var typeError = !envIs.match(/string|plainObject/);
  if( typeError ){
    throw new TypeError('`env` should  be string or object');
  }
  env = envIs.plainObject || { name : envIs.string };
  if( !env.name || !type(env.name).string ){
    throw new Error('give a name to search');
  }
  env.name = env.name.toLowerCase();
  return env;
}

function copyFields(env, modulePackage, cliPackage){
  if( !exports.packageFields.length ){ return ; }
  exports.packageFields.forEach(function(field){
    if( cliPackage && cliPackage[field] ){
      env.cliPackage[field] = cliPackage[field];
    }
    if( modulePackage && modulePackage[field] ){
      env.modulePackage[field] = modulePackage[field];
    }
  });
}
