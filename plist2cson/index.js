'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var js2cson = require('../js2cson');

var plist2js = require('../plist2js');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var js2cson__default = /*#__PURE__*/_interopDefaultLegacy(js2cson);

var plist2js__default = /*#__PURE__*/_interopDefaultLegacy(plist2js);

var plist2cson = (source, indent = 2) => js2cson__default['default'](plist2js__default['default'](source), indent);

exports.default = plist2cson;
