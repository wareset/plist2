'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var yaml2js = require('../yaml2js');

var js2cson = require('../js2cson');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var yaml2js__default = /*#__PURE__*/_interopDefaultLegacy(yaml2js);

var js2cson__default = /*#__PURE__*/_interopDefaultLegacy(js2cson);

var yaml2cson = (source, indent = 2) => js2cson__default['default'](yaml2js__default['default'](source), indent);

exports.default = yaml2cson;
