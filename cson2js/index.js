'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var lib = require('../lib');
/* eslint-disable security/detect-unsafe-regex */
// /^['"](?:\s*[\r\n\u2028\u2029]\s*)?|\\\s*[\r\n\u2028\u2029]\s*|(?:\s*[\r\n\u2028\u2029]\s*)?['"]$/g
// prettier-ignore


var reg1 = lib.regexp(['^[\'"](?:\\s*', lib.REG_CRLF, '\\s*)?|\\\\\\s*', lib.REG_CRLF, '\\s*|(?:\\s*', lib.REG_CRLF, '\\s*)?[\'"]$'], 'g'); // /\s*[\r\n\u2028\u2029]\s*/g

var reg2 = lib.regexp(['\\s*', lib.REG_CRLF, '\\s*'], 'g'); // /\\\s*[\r\n\u2028\u2029]\s*|(?:[\r\n\u2028\u2029]\s*)?'''$/g
// prettier-ignore

var reg3 = lib.regexp(['\\\\\\s*', lib.REG_CRLF, '\\s*|(?:', lib.REG_CRLF, "\\s*)?'''$"], 'g'); // /^'''(?:\s*?[\r\n\u2028\u2029])?/

var reg4 = lib.regexp(["^'''(?:\\s*?", lib.REG_CRLF, ')?'], ''); // /[\r\n\u2028\u2029]+/

var reg5 = lib.regexp([lib.REG_CRLF + '+'], '');
var __KEY__ = {}; // 'key'

var __SPACE__ = {}; // 'space'

var __VALUE__ = {}; // 'value'

var __PUNCT__ = {}; // 'punct'

var __ARRAY__ = {}; // 'array'

var __OBJECT__ = {}; // 'object'

var __ARRAY_STRICT__ = {}; // 'array_strict'

var __OBJECT_STRICT__ = {}; // 'object_strict'

var jsonStringParse = string => {
  string = string.trim();
  var first = string[0];

  if (first === '"' || first !== string[1]) {
    string = string.replace(reg1, lib.__EMPTY__).replace(reg2, ' ').replace(/\\[^]/g, r => r[1] === first ? first : r);
  } else {
    string = string.replace(reg3, lib.__EMPTY__).replace(/\\[^]/g, r => r[1] === "'" ? "'" : r);
    var arr = string.split(/(?![^\r\n\u2028\u2029])/g);

    var arr0 = (arr.shift() || lib.__EMPTY__).replace(reg4, lib.__EMPTY__);

    do {
      first = lib.__EMPTY__; // prettier-ignore

      arr.every(v => !v[1] || !first && (first = v[1]) || first === v[1] || (first = lib.__EMPTY__));

      if (first = /\s/.test(first)) {
        arr = arr.map(v => (v[0] || lib.__EMPTY__) + v.slice(2));
      }
    } while (first);

    string = arr0 + arr.join(lib.__EMPTY__);
  }

  string = lib.jsonStringify(string).replace(/\\\\/g, '\\');
  return string;
};

var jsonValueParse = v => {
  v = v.trim();
  var res;
  var tmp;
  if (v === lib.__TRUE__ || v === lib.__FALSE__) res = v === lib.__TRUE__; // else if (v === '-Infinity') res = -Infinity
  // else if (v === 'Infinity') res = Infinity
  else if (v === 'undefined') res = undefined;else if (v === 'null') res = null; // else if (v === 'NaN') res = NaN
    else res = !isNaN(tmp = +v) ? tmp : v; // /\w/.test(v) ? jsonStringify(v) : v

  return res;
};

var FN = Function;

var evaluate = str => new FN('return ' + str)();

var getCommentsFromArr = token0 => {
  var tmp0;
  var comments = [];

  if ((tmp0 = token0[1] === __ARRAY__) || token0[1] === __VALUE__) {
    comments = tmp0 ? token0[2][lib.__COMMENTS_KEY__] || {} : {
      0: token0[3]
    };
  }

  return lib.keys(comments).map(v => comments[v] || []);
};

var cson2js = source => {
  var tokens = [];
  var token;
  var tokenLast = [-2, lib.__EMPTY__, lib.__EMPTY__, []];
  var comments = [];
  var deep = -1;
  source.replace(/('''|'|")(?:[^\\]|\\\1|\\(?!\1).)*?\1|(:)|([,{}[\]])|(#[^\r\n\u2028\u2029]*)|(\s+)|([^\r\n\u2028\u2029,'"#:{}[\]]+)/g, (_result, _string, _colon, _punct, _comment, _space, _other) => {
    // console.log({ _result, _space, _string, _comment, _punct, _other })
    var type = lib.__EMPTY__;

    if (_space) {
      var arr = _result.split(reg5);

      if (arr.length > 1 || deep < 0) deep = (arr.pop() || lib.__EMPTY__).length;else type = __SPACE__;
    } else if (_other && ((_result = jsonValueParse(_result)) || true) || _string && ((_result = jsonStringParse(_result)) || true)) {
      type = __VALUE__;
    } else if (_colon) {
      if (tokenLast[1] !== __PUNCT__) {
        tokenLast[1] = __KEY__, tokenLast[2] += lib.__EMPTY__;
        if (tokenLast[2][0] === "'" || tokenLast[2][0] === '"') tokenLast[2] = lib.jsonParse(tokenLast[2]);
      }
    } else if (_punct) {
      type = __PUNCT__;
    } else if (_comment) {
      comments.push(_result.replace(/^#+\s?/, lib.__EMPTY__));
    }

    if (type) {
      if (deep < 0) deep = 0;
      tokens.push(token = [deep, type, _result, comments]);
      if (type !== __SPACE__) tokenLast = token;
      if (type !== __PUNCT__ && type !== __SPACE__) comments = [];
      deep += 1e-10;
    }

    return lib.__EMPTY__;
  });
  if (comments.length && tokenLast[3] !== comments) tokenLast[3].push(...comments);
  var i, j;
  var token0, token1, tokenL;
  var tokensTemp;
  var tokensPunct = [];

  var __plistComments__;

  var splice1 = () => {
    tokens.splice(++i, 1);
  };

  var token0Deep, token0Type, token0Value;
  var token1Deep, token1Type, token1Value;
  var tmp0, tmp1;
  i = tokens.length;

  while (i-- > -1) {
    if ((token0 = tokens[i]) && token0[1] === __SPACE__) {
      tokenL = tokens[i - 1];
      token1 = tokens[i + 1];

      if (!tokenL || !token1 || tokenL[1] !== __VALUE__ || token1[1] !== __VALUE__) {
        tokens.splice(i, 1);
      } else {
        tokenL[2] += token0[2] + token1[2];
        tokenL[3] = [...tokenL[3], ...token1[3]];
        tokens.splice(i, 2);
      }
    } else if ((token1 = tokens[i + 1]) && token1[1] === __VALUE__) {
      token1[2] = evaluate(token1[2]);
    }
  }

  i = tokens.length;

  while (i--) {
    if (token0 = tokens[i]) {
      [token0Deep, token0Type, token0Value] = token0;

      if (token0Type === __PUNCT__) {
        if (token0Value === ',') {
          tokens.splice(i, 1);
        } else if (token0Value === '}' || token0Value === ']') {
          tokensPunct.push(token0);
        } else {
          j = tokens.indexOf(tokensPunct.pop(), i);
          tokensTemp = tokens.splice(i + 1, j - i++);

          if (token0Value === '{') {
            token0[1] = __OBJECT_STRICT__, token0[2] = {};
            __plistComments__ = {};

            while (tokensTemp.length > 1) {
              token1Value = tokensTemp.shift()[2];
              __plistComments__ = { ...__plistComments__,
                ...(token1Value[lib.__COMMENTS_KEY__] || {})
              };
              token0[2] = { ...token0[2],
                ...token1Value
              };
            }

            lib.setComments(token0[2], __plistComments__);
          } else if (token0Value === '[') {
            token0[1] = __ARRAY_STRICT__, token0[2] = [];
            __plistComments__ = [];

            while (tokensTemp.length > 1) {
              token1 = tokensTemp.shift();
              [token1Deep, token1Type, token1Value] = token1;

              __plistComments__.push(...getCommentsFromArr(token1));

              token0[2].push(...(token1Type === __ARRAY__ ? token1Value : [token1Value]));
            }

            lib.setComments(token0[2], __plistComments__);
          }
        }
      } else if ((token1 = tokens[i + 1]) && token1[1] !== __PUNCT__) {
        [token1Deep, token1Type, token1Value] = token1;

        if (token0Type === __KEY__) {
          __plistComments__ = [...token0[3]];
          if (token1Type === __VALUE__) __plistComments__.push(...token1[3]);
          __plistComments__ = {
            [token0Value]: __plistComments__
          };
          token0[1] = __OBJECT__;
          token0[2] = {
            [token0Value]: token1Value
          };
          lib.setComments(token0[2], __plistComments__);
          splice1();
        } else if (token0Deep === token1Deep && token0Type === __OBJECT__ && token1Type === __OBJECT__) {
          __plistComments__ = { ...(token0Value[lib.__COMMENTS_KEY__] || {}),
            ...(token1Value[lib.__COMMENTS_KEY__] || {})
          };
          token0[2] = { ...token0Value,
            ...token1Value
          };
          lib.setComments(token0[2], __plistComments__);
          splice1();
        } else if (token0Deep <= token1Deep) {
          if (((tmp0 = token0Type === __ARRAY__) || token0Type !== __KEY__) && ((tmp1 = token1Type === __ARRAY__) || token1Type !== __KEY__)) {
            __plistComments__ = [...getCommentsFromArr(token0), ...getCommentsFromArr(token1)];
            token0[1] = __ARRAY__;
            token0[2] = [...(tmp0 ? token0Value : [token0Value]), ...(tmp1 ? token1Value : [token1Value])];
            lib.setComments(token0[2], __plistComments__);
            splice1();
          }
        }
      }
    }
  }

  var res;
  if (tokens.length === 1) res = tokens[0][2];else res = tokens.map(v => v[2]);
  return res;
};

exports.default = cson2js;
