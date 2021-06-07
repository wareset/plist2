'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var lib = require('../lib');

var NEW_LINE = '\n';

var toStr = v => "'" + ('' + v).replace(/(\\|')/g, '\\$1') + "'";

var getKey = v => v.split('').every((v, k) => !k && /[$_]/.test(v) || k && /[$\w]/.test(v) || v.toLowerCase() !== v.toUpperCase()) ? v : toStr(v);

var REG_CRLN = /\r\n?|\n|\u2028|\u2029/g; // prettier-ignore

var writeComments = (comment, indent, newline) => !comment ? '' : (lib.isArray(comment) ? comment : [comment]).map(v => v.split(REG_CRLN).map(v => newline + indent + `# ${v}`).join(lib.__EMPTY__)).join(lib.__EMPTY__);

var __js2cson__ = (source, indent, deep, parentTypeIsArr) => {
  deep++;
  var INDENT = lib.setIndent(indent, deep);
  var INDENT_LAST = lib.setIndent(indent, deep - 1); // const SEPARATOR = ' '

  var res = lib.__EMPTY__;

  if (lib.isArray(source)) {
    var comments = { ...(source[lib.__COMMENTS_KEY__] || {})
    };
    if (INDENT_LAST === INDENT) INDENT = lib.setIndent(indent, ++deep);
    source.forEach((v, k) => {
      res += writeComments(comments[k], INDENT, NEW_LINE);
      res += NEW_LINE + INDENT + __js2cson__(v, indent, deep, true);
    });
    res += writeComments(comments[lib.__EMPTY__], INDENT, NEW_LINE);
    res = '[' + res + NEW_LINE + INDENT_LAST + ']';
  } else if (lib.isObject(source)) {
    var _comments = { ...(source[lib.__COMMENTS_KEY__] || {})
    };
    var BRAKETS = parentTypeIsArr ? ['{', NEW_LINE + INDENT_LAST + '}'] : [lib.__EMPTY__, lib.__EMPTY__];
    lib.keys(source).forEach(k => {
      if (k !== lib.__COMMENTS_KEY__) {
        res += writeComments(_comments[k], INDENT, NEW_LINE); // prettier-ignore

        res += NEW_LINE + INDENT + getKey(k) + ': ' + __js2cson__(source[k], indent, deep);
      }
    });
    res += writeComments(_comments[lib.__EMPTY__], INDENT, NEW_LINE);
    res = BRAKETS[0] + res + BRAKETS[1];
  } else if (source === '' + source) {
    var arr = source.split(REG_CRLN);
    if (arr.length < 2) res = toStr(source);else res = "'''" + arr.map(v => NEW_LINE + INDENT + v.replace(/(\\|'')/g, '\\$1')).join(lib.__EMPTY__) + NEW_LINE + INDENT_LAST + "'''"; // } else if (source && source[__BINARY64_KEY__]) {
    //   res =
    //     '{' +
    //     SEPARATOR +
    //     getKey(__BINARY64_KEY__) +
    //     ':' +
    //     SEPARATOR +
    //     jsonStringify(source[__BINARY64_KEY__]) +
    //     SEPARATOR +
    //     '}'
  } else {
    try {
      res = '' + lib.jsonStringify(source, null, indent);

      if (res[0] === '"') {
        var res2 = res.slice(1, -1);
        if (!/'|"/.test(res2)) res = "'" + res2 + "'";
      }
    } catch (_e) {
      res = toStr(source);
    }
  }

  return res;
}; // prettier-ignore


var js2cson = (source, indent = 2) => __js2cson__(source, !indent ? '  ' : indent === +indent ? lib.repeat(' ', indent) : lib.__EMPTY__ + indent, -1).replace(/^\s+/, '');

exports.default = js2cson;
