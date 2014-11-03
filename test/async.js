'use strict';

var should = require('should');

module.exports = function(whech, util){

  it('should return object with all whech properties', function(done){

    whech('gulp', function(err, env){
      var keys = Object.keys(env);
      should(keys).containDeep(util.whechProps);
      should(keys.length).be.eql(util.whechProps.length);
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
