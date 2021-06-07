import {
  keys,
  repeat,
  isArray,
  isObject,
  setIndent,
  jsonStringify,
  __EMPTY__,
  __COMMENTS_KEY__,
  __BINARY64_KEY__
} from './lib'

const NEW_LINE = '\n'

const toStr = (v: any): string =>
  "'" + ('' + v).replace(/(\\|')/g, '\\$1') + "'"

const getKey = (v: string): string =>
  v
    .split('')
    .every(
      (v, k) =>
        (!k && /[$_]/.test(v)) ||
        (k && /[$\w]/.test(v)) ||
        v.toLowerCase() !== v.toUpperCase()
    )
    ? v
    : toStr(v)

const REG_CRLN = /\r\n?|\n|\u2028|\u2029/g

// prettier-ignore
const writeComments = (comment: any, indent: string, newline: string): string =>
  !comment
    ? ''
    : (isArray(comment) ? comment : [comment])
      .map((v) => v.split(REG_CRLN).map((v: any) => newline + indent + `# ${v}`).join(__EMPTY__))
      .join(__EMPTY__)

const __js2cson__ = (
  source: any,
  indent: string,
  deep: number,
  parentTypeIsArr?: boolean
): string => {
  deep++
  let INDENT = setIndent(indent, deep)
  const INDENT_LAST = setIndent(indent, deep - 1)
  // const SEPARATOR = ' '

  let res = __EMPTY__

  if (isArray(source)) {
    const comments: any = { ...((source as any)[__COMMENTS_KEY__] || {}) }
    if (INDENT_LAST === INDENT) INDENT = setIndent(indent, ++deep)

    source.forEach((v, k) => {
      res += writeComments(comments[k], INDENT, NEW_LINE)
      res += NEW_LINE + INDENT + __js2cson__(v, indent, deep, true)
    })
    res += writeComments(comments[__EMPTY__], INDENT, NEW_LINE)
    res = '[' + res + NEW_LINE + INDENT_LAST + ']'
  } else if (isObject(source)) {
    const comments: any = { ...((source as any)[__COMMENTS_KEY__] || {}) }

    const BRAKETS = parentTypeIsArr
      ? ['{', NEW_LINE + INDENT_LAST + '}']
      : [__EMPTY__, __EMPTY__]

    keys(source).forEach((k) => {
      if (k !== __COMMENTS_KEY__) {
        res += writeComments(comments[k], INDENT, NEW_LINE)
        // prettier-ignore
        res += NEW_LINE + INDENT + getKey(k) + ': ' +
          __js2cson__(source[k], indent, deep)
      }
    })

    res += writeComments(comments[__EMPTY__], INDENT, NEW_LINE)
    res = BRAKETS[0] + res + BRAKETS[1]
  } else if (source === '' + source) {
    const arr: string[] = source.split(REG_CRLN)
    if (arr.length < 2) res = toStr(source)
    else
      res =
        "'''" +
        arr
          .map((v) => NEW_LINE + INDENT + v.replace(/(\\|'')/g, '\\$1'))
          .join(__EMPTY__) +
        NEW_LINE +
        INDENT_LAST +
        "'''"
    // } else if (source && source[__BINARY64_KEY__]) {
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
      res = '' + jsonStringify(source, null, indent)
      if (res[0] === '"') {
        const res2 = res.slice(1, -1)
        if (!/'|"/.test(res2)) res = "'" + res2 + "'"
      }
    } catch (_e) {
      res = toStr(source)
    }
  }

  return res
}

// prettier-ignore
export default (source: any, indent: number | string = 2): string =>
  __js2cson__(
    source,
    !indent
      ? '  '
      : indent === +indent
        ? repeat(' ', indent)
        : __EMPTY__ + indent,
    -1
  ).replace(/^\s+/, '')
