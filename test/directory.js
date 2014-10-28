'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');
var camelcase = require('../utils/camelcase');

module.exports = function(requirem){

  it('should get directories with camelCased keys', function(){
    var testModules = requirem('./modules/');
    should(testModules).be.an.Object
      .and
      .have.properties(
        fs.readdirSync('./test/modules').map(function(fileName){
          return camelcase(path.basename(fileName, path.extname(fileName)));
        })
      );
  });
};
