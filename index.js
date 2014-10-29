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

function whech(cmd_, cb){
  var cmd = check(cmd_);
  cmd.cwd = cmd.cwd || process.cwd();

  which(cmd.name, function(err, whichName){
    cmd.which = err || whichName;
    cmd.runFromBin = cmd.which === argv[1];

    npm.load(function(cli, npm_){
      cmd.mainDir = npm_.dir;
      cmd.globalDir = npm_.globalDir;

      var cliPackage; cmd.cliPackage = { };
      var modulePackage; cmd.modulePackage = { };
      var pack = path.join(cmd.name, 'package');

      try {  modulePackage = require(path.join(cmd.mainDir, pack));  }
        catch(err){  cmd.modulePackage = err;  }
      try {  cliPackage = require(path.join(cmd.globalDir, pack));  }
        catch(err){  cmd.cliPackage = err;  }

      copyFields(cmd, modulePackage, cliPackage);

      if( cmd.runFromBin ){
        cmd.extension = cmd.extension || '.js';
        cmd.configFile = cmd.configFile || cmd.name + 'file';
        if( !path.extname(cmd.configFile) ){  cmd.configFile += cmd.extension;  }
        cmd.configFile = findup(cmd.configFile, { cwd : cmd.cwd });

        findup(process.cwd(), cmd.configFile, function(err, configDir){
          cmd.configFile = err || path.join(configDir, cmd.configFile);
          cb(err, cmd);
        });
      } else {
        cmd.configFile = argv[1];
        if( cmd.configFile !== path.basename(cmd.configFile) ){
          cmd.mainDir = path.join(cmd.cwd, path.dirname(cmd.configFile));
        }
        cb(err, cmd);
      }
    });
  });
}

function whechSync(cmd_){
  var cmd = check(cmd_);
  cmd.cwd = process.cwd();

  var which = require('which');
  var findup = require('findup-sync');

  cmd.which = which.sync(cmd.name);
  cmd.runFromBin = cmd.which === argv[1];

  cmd.mainDir = main.paths[0];
  cmd.globalDir = null;
  // TODO: find a non hacky way to do this
  try{
    cmd.globalDir = path.resolve(cmd.which, '..', '..', 'lib', 'node_modules');
  } catch(err){
      cmd.which  = new Error('not found');
      cmd.globalDir = new Error('counld not find globalDir');
    }

  var cliPackage; cmd.cliPackage = { };
  var modulePackage; cmd.modulePackage = { };
  var pack = path.join(cmd.name, 'package');
  try {  modulePackage = require(path.join(cmd.mainDir, pack));  }
    catch(err){  cmd.modulePackage = err;  }
  try {  cliPackage = require(path.join(cmd.globalDir, pack));  }
    catch(err){  cmd.cliPackage = err;  }

  copyFields(cmd, modulePackage, cliPackage);

  if( cmd.runFromBin ){
    cmd.extension = cmd.extension || '.js';
    cmd.configFile = cmd.configFile || cmd.name + 'file';
    if( !path.extname(cmd.configFile) ){  cmd.configFile += cmd.extension;  }
    cmd.configFile = findup(cmd.configFile, { cwd : cmd.cwd });
  } else {
    cmd.configFile = argv[1];
    if( cmd.configFile !== path.basename(cmd.configFile) ){
      cmd.mainDir = path.join(cmd.cwd, path.dirname(cmd.configFile));
    }
  }

  return cmd;
}



function check(cmd){
  var cmdIs = type(cmd);
  var typeError = !cmdIs.match(/string|plainObject/);
  if( typeError ){  throw new TypeError('`cmd` should  be string or object');  }
  cmd = cmdIs.plainObject || { name : cmdIs.string };
  if( !cmd.name ){  throw new Error('give a name to search');  }
  cmd.name = cmd.name.toLowerCase();
  return cmd;
}

function copyFields(cmd, modulePackage, cliPackage){
  if( !exports.packageFields.length ){ return ; }
  exports.packageFields.forEach(function(field){
    if( cliPackage && cliPackage[field] ){
      cmd.cliPackage[field] = cliPackage[field];
    }
    if( modulePackage && modulePackage[field] ){
      cmd.modulePackage[field] = modulePackage[field];
    }
  });
}
