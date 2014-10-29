'use strict';

var should = require('should');

module.exports = function(whech){

  it('should return object with all whech properties', function(){
    var env = whech.sync('which');
    should(env).be.an.Object
      .and
      .have.properties([
        'name',
        'cwd',
        'which',
        'runFromBin',
        'mainDir',
        'globalDir',
        'cliPackage',
        'modulePackage',
        'configFile'
     ]);
  });
};
