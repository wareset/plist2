'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var cson2js = require('../cson2js');

var js2plist = require('../js2plist');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var cson2js__default = /*#__PURE__*/_interopDefaultLegacy(cson2js);

var js2plist__default = /*#__PURE__*/_interopDefaultLegacy(js2plist);

var cson2plist = (source, indent = 2) => js2plist__default['default'](cson2js__default['default'](source), indent);

exports.default = cson2plist;
