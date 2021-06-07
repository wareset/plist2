'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var lib = require('../lib');

var js2cson = require('../js2cson');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var js2cson__default = /*#__PURE__*/_interopDefaultLegacy(js2cson);

var json2cson = (source, indent = 2) => js2cson__default['default'](lib.jsonParse(source), indent);

exports.default = json2cson;
