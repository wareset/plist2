'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var cson2js = require('../cson2js');

var js2yaml = require('../js2yaml');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var cson2js__default = /*#__PURE__*/_interopDefaultLegacy(cson2js);

var js2yaml__default = /*#__PURE__*/_interopDefaultLegacy(js2yaml);

var cson2yaml = (source, indent = 2) => js2yaml__default['default'](cson2js__default['default'](source), indent);

exports.default = cson2yaml;
