'use strict';

var should = require('should');

module.exports = function(whech){

  it('should return object with all whech properties', function(done){

    whech('gulp', function(err, env){
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
      done();
    });
  });

  it('env.configFile should not be null', function(done){
    whech('gulp', function(err, env){
      env.configFile.should.not.be.eql(null);
      done();
    });
  });
};
