'use strict';

var should = require('should');

module.exports = function(whech){

  it('should return object with all whech properties', function(){
    var env = whech.sync('gulp');
    should(env).be.an.Object
      .and
      .have.properties([
        'name',
        'bin',
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

  it('env.configFile should not be null', function(){
    var env = whech.sync('gulp');
    env.configFile.should.not.be.eql(null);
  });
};
