/* eslint-disable security/detect-unsafe-regex */

import { __EMPTY__, __COMMENTS_KEY__, __TRUE__, __FALSE__ } from './lib'
import { keys, setComments, jsonStringify, jsonParse } from './lib'
import { REG_CRLF, regexp } from './lib'

// /^['"](?:\s*[\r\n\u2028\u2029]\s*)?|\\\s*[\r\n\u2028\u2029]\s*|(?:\s*[\r\n\u2028\u2029]\s*)?['"]$/g
// prettier-ignore
const reg1 = regexp(['^[\'"](?:\\s*', REG_CRLF,
  '\\s*)?|\\\\\\s*', REG_CRLF, '\\s*|(?:\\s*', REG_CRLF, '\\s*)?[\'"]$'], 'g')

// /\s*[\r\n\u2028\u2029]\s*/g
const reg2 = regexp(['\\s*', REG_CRLF, '\\s*'], 'g')

// /\\\s*[\r\n\u2028\u2029]\s*|(?:[\r\n\u2028\u2029]\s*)?'''$/g
// prettier-ignore
const reg3 = regexp(
  ['\\\\\\s*', REG_CRLF, '\\s*|(?:', REG_CRLF, "\\s*)?'''$"], 'g')

// /^'''(?:\s*?[\r\n\u2028\u2029])?/
const reg4 = regexp(["^'''(?:\\s*?", REG_CRLF, ')?'], '')

// /[\r\n\u2028\u2029]+/
const reg5 = regexp([REG_CRLF + '+'], '')

type Token = [number, any, any, any[]]

const __KEY__ = {} // 'key'
const __SPACE__ = {} // 'space'
const __VALUE__ = {} // 'value'
const __PUNCT__ = {} // 'punct'
const __ARRAY__ = {} // 'array'
const __OBJECT__ = {} // 'object'
const __ARRAY_STRICT__ = {} // 'array_strict'
const __OBJECT_STRICT__ = {} // 'object_strict'

const jsonStringParse = (string: string): string => {
  string = string.trim()
  let first: any = string[0]
  if (first === '"' || first !== string[1]) {
    string = string
      .replace(reg1, __EMPTY__)
      .replace(reg2, ' ')
      .replace(/\\[^]/g, (r) => (r[1] === first ? first : r))
  } else {
    string = string
      .replace(reg3, __EMPTY__)
      .replace(/\\[^]/g, (r) => (r[1] === "'" ? "'" : r))

    let arr = string.split(/(?![^\r\n\u2028\u2029])/g)
    const arr0 = (arr.shift() || __EMPTY__).replace(reg4, __EMPTY__)
    do {
      first = __EMPTY__
      // prettier-ignore
      arr.every((v) => !v[1] || (!first &&
          (first = v[1])) || first === v[1] || (first = __EMPTY__))
      if ((first = /\s/.test(first))) {
        arr = arr.map((v) => (v[0] || __EMPTY__) + v.slice(2))
      }
    } while (first)
    string = arr0 + arr.join(__EMPTY__)
  }

  string = jsonStringify(string).replace(/\\\\/g, '\\')
  return string
}

const jsonValueParse = (v: string): any => {
  v = v.trim()
  let res
  let tmp
  if (v === __TRUE__ || v === __FALSE__) res = v === __TRUE__
  // else if (v === '-Infinity') res = -Infinity
  // else if (v === 'Infinity') res = Infinity
  else if (v === 'undefined') res = undefined
  else if (v === 'null') res = null
  // else if (v === 'NaN') res = NaN
  else res = !isNaN((tmp = +v)) ? tmp : v // /\w/.test(v) ? jsonStringify(v) : v
  return res
}

const FN = Function
const evaluate = (str: string): any => new FN('return ' + str)()

const getCommentsFromArr = (token0: Token): any => {
  let tmp0
  let comments: any = []
  if ((tmp0 = token0[1] === __ARRAY__) || token0[1] === __VALUE__) {
    comments = tmp0 ? token0[2][__COMMENTS_KEY__] || {} : { 0: token0[3] }
  }
  return keys(comments).map((v) => comments[v] || [])
}

export default (source: string): any => {
  const tokens: Token[] = []
  let token: Token
  let tokenLast: Token = [-2, __EMPTY__, __EMPTY__, []]
  let comments: string[] = []

  let deep = -1
  source.replace(
    /('''|'|")(?:[^\\]|\\\1|\\(?!\1).)*?\1|(:)|([,{}[\]])|(#[^\r\n\u2028\u2029]*)|(\s+)|([^\r\n\u2028\u2029,'"#:{}[\]]+)/g,
    (_result, _string, _colon, _punct, _comment, _space, _other) => {
      // console.log({ _result, _space, _string, _comment, _punct, _other })

      let type: any = __EMPTY__

      if (_space) {
        const arr: string[] = _result.split(reg5)
        if (arr.length > 1 || deep < 0) deep = (arr.pop() || __EMPTY__).length
        else type = __SPACE__
      } else if (
        (_other && ((_result = jsonValueParse(_result)) || true)) ||
        (_string && ((_result = jsonStringParse(_result)) || true))
      ) {
        type = __VALUE__
      } else if (_colon) {
        if (tokenLast[1] !== __PUNCT__) {
          ;(tokenLast[1] = __KEY__), (tokenLast[2] += __EMPTY__)
          if (tokenLast[2][0] === "'" || tokenLast[2][0] === '"')
            tokenLast[2] = jsonParse(tokenLast[2])
        }
      } else if (_punct) {
        type = __PUNCT__
      } else if (_comment) {
        comments.push(_result.replace(/^#+\s?/, __EMPTY__))
      }

      if (type) {
        if (deep < 0) deep = 0
        tokens.push((token = [deep, type, _result, comments]))
        if (type !== __SPACE__) tokenLast = token
        if (type !== __PUNCT__ && type !== __SPACE__) comments = []
        deep += 1e-10
      }

      return __EMPTY__
    }
  )

  if (comments.length && tokenLast[3] !== comments)
    tokenLast[3].push(...comments)

  let i: number, j: number
  let token0: Token, token1: Token, tokenL: Token
  let tokensTemp: Token[]
  const tokensPunct: Token[] = []
  let __plistComments__: any

  const splice1 = (): void => {
    tokens.splice(++i, 1)
  }

  let token0Deep, token0Type, token0Value
  let token1Deep, token1Type, token1Value
  let tmp0, tmp1

  i = tokens.length
  while (i-- > -1) {
    if ((token0 = tokens[i]) && token0[1] === __SPACE__) {
      tokenL = tokens[i - 1]
      token1 = tokens[i + 1]

      if (
        !tokenL ||
        !token1 ||
        tokenL[1] !== __VALUE__ ||
        token1[1] !== __VALUE__
      ) {
        tokens.splice(i, 1)
      } else {
        tokenL[2] += token0[2] + token1[2]
        tokenL[3] = [...tokenL[3], ...token1[3]]
        tokens.splice(i, 2)
      }
    } else if ((token1 = tokens[i + 1]) && token1[1] === __VALUE__) {
      token1[2] = evaluate(token1[2])
    }
  }

  i = tokens.length
  while (i--) {
    if ((token0 = tokens[i])) {
      ;[token0Deep, token0Type, token0Value] = token0

      if (token0Type === __PUNCT__) {
        if (token0Value === ',') {
          tokens.splice(i, 1)
        } else if (token0Value === '}' || token0Value === ']') {
          tokensPunct.push(token0)
        } else {
          j = tokens.indexOf(tokensPunct.pop()!, i)
          tokensTemp = tokens.splice(i + 1, j - i++)

          if (token0Value === '{') {
            ;(token0[1] = __OBJECT_STRICT__), (token0[2] = {})

            __plistComments__ = {}
            while (tokensTemp.length > 1) {
              token1Value = tokensTemp.shift()![2]
              __plistComments__ = {
                ...__plistComments__,
                ...(token1Value[__COMMENTS_KEY__] || {})
              }
              token0[2] = { ...token0[2], ...token1Value }
            }
            setComments(token0[2], __plistComments__)
          } else if (token0Value === '[') {
            ;(token0[1] = __ARRAY_STRICT__), (token0[2] = [])

            __plistComments__ = []
            while (tokensTemp.length > 1) {
              token1 = tokensTemp.shift()!
              ;[token1Deep, token1Type, token1Value] = token1
              __plistComments__.push(...getCommentsFromArr(token1!))
              token0[2].push(
                ...(token1Type === __ARRAY__ ? token1Value : [token1Value])
              )
            }
            setComments(token0[2], __plistComments__)
          }
        }
      } else if ((token1 = tokens[i + 1]) && token1[1] !== __PUNCT__) {
        ;[token1Deep, token1Type, token1Value] = token1

        if (token0Type === __KEY__) {
          __plistComments__ = [...token0[3]]
          if (token1Type === __VALUE__) __plistComments__.push(...token1[3])
          __plistComments__ = { [token0Value]: __plistComments__ }

          token0[1] = __OBJECT__
          token0[2] = { [token0Value]: token1Value }

          setComments(token0[2], __plistComments__)
          splice1()
        } else if (
          token0Deep === token1Deep &&
          token0Type === __OBJECT__ &&
          token1Type === __OBJECT__
        ) {
          __plistComments__ = {
            ...(token0Value[__COMMENTS_KEY__] || {}),
            ...(token1Value[__COMMENTS_KEY__] || {})
          }

          token0[2] = { ...token0Value, ...token1Value }

          setComments(token0[2], __plistComments__)
          splice1()
        } else if (token0Deep <= token1Deep) {
          if (
            ((tmp0 = token0Type === __ARRAY__) || token0Type !== __KEY__) &&
            ((tmp1 = token1Type === __ARRAY__) || token1Type !== __KEY__)
          ) {
            __plistComments__ = [
              ...getCommentsFromArr(token0),
              ...getCommentsFromArr(token1)
            ]

            token0[1] = __ARRAY__
            token0[2] = [
              ...(tmp0 ? token0Value : [token0Value]),
              ...(tmp1 ? token1Value : [token1Value])
            ]

            setComments(token0[2], __plistComments__)
            splice1()
          }
        }
      }
    }
  }

  let res
  if (tokens.length === 1) res = tokens[0][2]
  else res = tokens.map((v) => v[2])

  return res
}
