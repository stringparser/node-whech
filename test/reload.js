'use strict';

var should = require('should');

module.exports = function patterns(requirem){

  it('should be able to reload', function(){
    var reload = requirem('./modules/reload');
    should([reload(), reload(), reload(), reload()])
      .be.eql([1, 2, 3, 4]);
    should(requirem('./modules/reload', { reload : true })())
      .be.a.Number
      .and
      .be.eql(1);
  });

  it('should be able to reload directories', function(){
    var dir = requirem('./modules/', { reload : true });
    should([dir.reload(), dir.reload(), dir.reload(), dir.reload()])
      .be.eql([1, 2, 3, 4]);
    should(requirem('./modules/', { reload : true }).reload())
      .be.eql(1);
  });
};
