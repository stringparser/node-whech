'use strict';

var path = require('path');
var packageName = require('../package').name;
var pack = require('../');

var util = require('./_util.js');

// the dummy configFile
process.argv[1] = 'test/gulpfile';

describe(packageName, function(){

  util.testSuite().forEach(function(file){
    var suite = path.basename(file, path.extname(file));
    describe(suite, function(){
      // the actual suite code
      require('./'+file)(pack, util);
    });
  });
});
