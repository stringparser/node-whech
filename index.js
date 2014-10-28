'use strict';

var npm = require('npm');
var path = require('path');
var which = require('which');
var findup = require('findup');
var type = require('utils-type');

exports = module.exports = whichBlib;
exports.sync = syncWhichBlib;
exports.packageFields = ['version'];

var argv = process.argv;
var main = process.mainModule;

function whichBlib(cmd_, cb){
  var cmd = check(cmd_);

  which(cmd.name, function(err, whichName){
    if(err){ throw cb(err); }
    cmd.extension = cmd.extension || '.js';
    cmd.which = whichName;
    cmd.runFromBin = cmd.which === argv[1];
    cmd.configFile = cmd.configFile || cmd.name + 'file';
    if( !path.extname(cmd.configFile) ){  cmd.configFile += cmd.extension;  }
    npm.load(function(cli, npm_){
      findup(process.cwd(), cmd.configFile, function(err, configDir){
        cmd.mainDir = npm_.dir;
        cmd.globalDir = npm_.globalDir;

        if( !err ){ cmd.configFile = path.join(configDir, cmd.configFile); }
        else { cmd.configFile = err; }

        var cliPackage; cmd.cliPackage = { };
        var modulePackage; cmd.modulePackage = { };
        var pack = path.join(cmd.name, 'package');
        try {  modulePackage = require(path.join(cmd.mainDir, pack));  }
          catch(err){
            cmd.modulePackage = err;
            return cb(err, cmd);
          }
        try {  cliPackage = require(path.join(cmd.globalDir, pack));  }
          catch(err){
            cmd.cliPackage = err;
            copyFields(cmd, modulePackage);
            return cb(err, cmd);
          }

        copyFields(cmd, modulePackage, cliPackage);
        cb(err || null, cmd);
      });
    });
  });
}

function syncWhichBlib(cmd_){
  var cmd = check(cmd_);
  cmd.cwd = process.cwd();
  cmd.extension = cmd.extension || '.js';
  cmd.configFile = cmd.configFile || cmd.name + 'file';
  if( !path.extname(cmd.configFile) ){  cmd.configFile += cmd.extension;  }

  var which = require('which');
  var findup = require('findup-sync');

  cmd.which = which.sync(cmd.name);
  cmd.runFromBin = cmd.which === argv[1];
  cmd.configFile = findup(cmd.configFile, { cwd : cmd.cwd });

  cmd.mainDir = main.paths[0];
  cmd.globalDir = null;
  if( cmd.which ){
    // TODO: find a non hacky way to do this
    cmd.globalDir = path.resolve(cmd.which || '.', '..', '..', 'lib', 'node_modules');
  }

  var cliPackage; cmd.cliPackage = { };
  var modulePackage; cmd.modulePackage = { };
  var pack = path.join(cmd.name, 'package');
  try {  modulePackage = require(path.join(cmd.mainDir, pack));  }
    catch(err){
      cmd.modulePackage = err;
      return cmd;
    }
  try {  cliPackage = require(path.join(cmd.globalDir, pack));  }
    catch(err){
      cmd.cliPackage = err;
      copyFields(cmd, modulePackage);
      return cmd;
    }

  copyFields(cmd, modulePackage, cliPackage);
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
