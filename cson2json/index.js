'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var cson2js = require('../cson2js');

var js2json = require('../js2json');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var cson2js__default = /*#__PURE__*/_interopDefaultLegacy(cson2js);

var js2json__default = /*#__PURE__*/_interopDefaultLegacy(js2json);

var cson2json = (source, indent = 2) => js2json__default['default'](cson2js__default['default'](source), indent);

exports.default = cson2json;
