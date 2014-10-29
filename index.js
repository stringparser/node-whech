'use strict';

var npm = require('npm');
var path = require('path');
var which = require('which');
var findup = require('findup');
var type = require('utils-type');

exports = module.exports = whech;
exports.sync = whechSync;
exports.packageFields = ['version'];

var argv = process.argv;
var main = process.mainModule;

function whech(env_, cb){
  var env = check(env_);
  env.cwd = env.cwd || process.cwd();

  which(env.name, function(err, whichName){
    env.which = err || whichName;
    env.runFromBin = env.which === argv[1];

    npm.load(function(cli, npm_){
      env.mainDir = npm_.dir;
      env.globalDir = npm_.globalDir;

      var cliPackage; env.cliPackage = { };
      var modulePackage; env.modulePackage = { };
      var pack = path.join(env.name, 'package');

      try {  modulePackage = require(path.join(env.mainDir, pack));  }
        catch(err){  env.modulePackage = err;  }
      try {  cliPackage = require(path.join(env.globalDir, pack));  }
        catch(err){  env.cliPackage = err;  }

      copyFields(env, modulePackage, cliPackage);

      env.extension = env.extension || '.js';
      env.configFile = env.configFile || env.name + 'file';
      if( !path.extname(env.configFile) ){  env.configFile += env.extension;  }
      if( !env.runFromBin ){
        env.cwd = path.resolve(env.cwd, path.dirname(argv[1]));
        env.configFile = path.basename(argv[1]);
      }


      findup(process.cwd(), env.configFile, function(err, configDir){
        env.configFile = err || path.join(configDir, env.configFile);
        cb(err, env);
      });
    });
  });
}

function whechSync(env_){
  var env = check(env_);
  env.cwd = env.cwd || process.cwd();

  var which = require('which');
  var findup = require('findup-sync');

  env.which = which.sync(env.name);
  env.runFromBin = env.which === argv[1];

  env.mainDir = path.join(env.cwd, 'node_modules');
  env.globalDir = null;
  // TODO: find a non hacky way to do this
  try{
    env.globalDir = path.resolve(env.which, '..', '..', 'lib', 'node_modules');
  } catch(err){
      env.which  = new Error('not found');
      env.globalDir = new Error('counld not find globalDir');
    }

  var cliPackage; env.cliPackage = { };
  var modulePackage; env.modulePackage = { };
  var pack = path.join(env.name, 'package');
  try {  modulePackage = require(path.join(env.mainDir, pack));  }
    catch(err){  env.modulePackage = err;  }
  try {  cliPackage = require(path.join(env.globalDir, pack));  }
    catch(err){  env.cliPackage = err;  }

  copyFields(env, modulePackage, cliPackage);

  env.extension = env.extension || '.js';
  env.configFile = env.configFile || env.name + 'file';
  if( !path.extname(env.configFile) ){  env.configFile += env.extension;  }
  if( !env.runFromBin ){
    env.cwd = path.resolve(env.cwd, path.dirname(argv[1]));
    env.configFile = path.basename(argv[1]);
  }
  env.configFile = findup(env.configFile, { cwd : env.cwd });

  return env;
}



function check(env){
  var envIs = type(env);
  var typeError = !envIs.match(/string|plainObject/);
  if( typeError ){  throw new TypeError('`env` should  be string or object');  }
  env = envIs.plainObject || { name : envIs.string };
  if( !env.name ){  throw new Error('give a name to search');  }
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
