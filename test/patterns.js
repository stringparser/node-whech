'use strict';

var should = require('should');

module.exports = function patterns(requirem){

  it('should be able to filter', function(){
    should(requirem('./modules/', /(.*)(?=stuff\.js)/).someStuff)
      .be.an.Object
      .and
      .be.eql(require('./modules/Some-stuff'));
  });

  it('should be able to filter with no other args', function(){
    should(requirem(/patterns\.js/).patterns)
      .be.a.Function
      .and
      .have.property('name', require('./patterns.js').name);
  });
};
