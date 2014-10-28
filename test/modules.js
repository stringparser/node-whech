'use strict';

var should = require('should');

module.exports = function(requirem){

  it('should get the correct module', function(){
    should(requirem('./modules/_fakeExports'))
      .be.an.Object
      .and
      .be.eql(require('./modules/_fakeExports'));
  });

  it('should get the correct node_module', function(){
    should(requirem('callers-path'))
      .be.a.Function
      .and
      .have.property('name', require('callers-path').name);
  });
};
