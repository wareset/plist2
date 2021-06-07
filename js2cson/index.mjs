import { repeat, __EMPTY__, setIndent, isArray, __COMMENTS_KEY__, isObject, keys, jsonStringify } from '../lib';
var NEW_LINE = '\n';

var toStr = v => "'" + ('' + v).replace(/(\\|')/g, '\\$1') + "'";

var getKey = v => v.split('').every((v, k) => !k && /[$_]/.test(v) || k && /[$\w]/.test(v) || v.toLowerCase() !== v.toUpperCase()) ? v : toStr(v);

var REG_CRLN = /\r\n?|\n|\u2028|\u2029/g; // prettier-ignore

var writeComments = (comment, indent, newline) => !comment ? '' : (isArray(comment) ? comment : [comment]).map(v => v.split(REG_CRLN).map(v => newline + indent + `# ${v}`).join(__EMPTY__)).join(__EMPTY__);

var __js2cson__ = (source, indent, deep, parentTypeIsArr) => {
  deep++;
  var INDENT = setIndent(indent, deep);
  var INDENT_LAST = setIndent(indent, deep - 1); // const SEPARATOR = ' '

  var res = __EMPTY__;

  if (isArray(source)) {
    var comments = { ...(source[__COMMENTS_KEY__] || {})
    };
    if (INDENT_LAST === INDENT) INDENT = setIndent(indent, ++deep);
    source.forEach((v, k) => {
      res += writeComments(comments[k], INDENT, NEW_LINE);
      res += NEW_LINE + INDENT + __js2cson__(v, indent, deep, true);
    });
    res += writeComments(comments[__EMPTY__], INDENT, NEW_LINE);
    res = '[' + res + NEW_LINE + INDENT_LAST + ']';
  } else if (isObject(source)) {
    var _comments = { ...(source[__COMMENTS_KEY__] || {})
    };
    var BRAKETS = parentTypeIsArr ? ['{', NEW_LINE + INDENT_LAST + '}'] : [__EMPTY__, __EMPTY__];
    keys(source).forEach(k => {
      if (k !== __COMMENTS_KEY__) {
        res += writeComments(_comments[k], INDENT, NEW_LINE); // prettier-ignore

        res += NEW_LINE + INDENT + getKey(k) + ': ' + __js2cson__(source[k], indent, deep);
      }
    });
    res += writeComments(_comments[__EMPTY__], INDENT, NEW_LINE);
    res = BRAKETS[0] + res + BRAKETS[1];
  } else if (source === '' + source) {
    var arr = source.split(REG_CRLN);
    if (arr.length < 2) res = toStr(source);else res = "'''" + arr.map(v => NEW_LINE + INDENT + v.replace(/(\\|'')/g, '\\$1')).join(__EMPTY__) + NEW_LINE + INDENT_LAST + "'''"; // } else if (source && source[__BINARY64_KEY__]) {
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
      res = '' + jsonStringify(source, null, indent);

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


var js2cson = (source, indent = 2) => __js2cson__(source, !indent ? '  ' : indent === +indent ? repeat(' ', indent) : __EMPTY__ + indent, -1).replace(/^\s+/, '');

export default js2cson;
