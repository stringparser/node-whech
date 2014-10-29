'use strict';

var should = require('should');

module.exports = function(whech){

  it('should return object with all whech properties', function(done){

    whech('which', function(err, whech_){
      should(err).be.eql(null);
      should(whech_).be.an.Object
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
      done();
    });
  });
};
