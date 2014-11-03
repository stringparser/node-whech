'use strict';

var should = require('should');

module.exports = function(whech, util){

  it('should return object with all whech properties', function(){
    var env = whech.sync('gulp');  var keys = Object.keys(env);
    should(keys).containDeep(util.whechProps);
    should(keys.length).be.eql(util.whechProps.length);
  });

  it('env.configFile should not be null', function(){
    var env = whech.sync('gulp');
    env.configFile.should.not.be.eql(null);
  });
};
