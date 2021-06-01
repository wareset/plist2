import {
  keys,
  repeat,
  isArray,
  isObject,
  setIndent,
  stringify,
  __EMPTY__,
  __PLIST_COMMENTS_KEY__,
  __PLIST_DATA_KEY__
} from './lib'

const __js2json__ = (source: any, indent: string, deep: number): string => {
  deep++
  let INDENT = __EMPTY__
  let NEW_LINE = __EMPTY__
  let INDENT_LAST = __EMPTY__
  let SEPARATOR = indent ? ' ' : __EMPTY__

  let res = __EMPTY__
  let isMod: boolean
  const arr: any = []

  if (isArray(source)) {
    // if (source.some((v) => isArray(v) || isObject(v))) {
    //   INDENT = setIndent(indent, deep)
    //   NEW_LINE = indent ? '\n' : __EMPTY__
    //   INDENT_LAST = setIndent(indent, deep - 1)
    //   SEPARATOR = __EMPTY__
    // }

    source.forEach((v) => {
      if (!isMod && (isArray(v) || isObject(v))) {
        isMod = true
        INDENT = setIndent(indent, deep)
        NEW_LINE = indent ? '\n' : __EMPTY__
        INDENT_LAST = setIndent(indent, deep - 1)
        SEPARATOR = __EMPTY__
      }

      arr.push(__js2json__(v, indent, deep))
    })
    res =
      '[' +
      arr.map((v: any) => NEW_LINE + INDENT + v).join(',' + SEPARATOR) +
      NEW_LINE +
      INDENT_LAST +
      ']'
  } else if (isObject(source)) {
    const sKeys = keys(source)
    NEW_LINE = SEPARATOR
    // if (sKeys.some((k) => isArray(source[k]) || isObject(source[k]))) {
    //   INDENT = setIndent(indent, deep)
    //   NEW_LINE = indent ? '\n' : __EMPTY__
    //   INDENT_LAST = setIndent(indent, deep - 1)
    // }

    sKeys.forEach((k) => {
      if (k !== __PLIST_COMMENTS_KEY__) {
        if (!isMod && (isArray(source[k]) || isObject(source[k]))) {
          isMod = true
          INDENT = setIndent(indent, deep)
          NEW_LINE = indent ? '\n' : __EMPTY__
          INDENT_LAST = setIndent(indent, deep - 1)
        }

        arr.push([stringify(k) + ':', __js2json__(source[k], indent, deep)])
      }
    })
    res =
      '{' +
      arr
        .map((v: any) => NEW_LINE + INDENT + v[0] + SEPARATOR + v[1])
        .join(',') +
      NEW_LINE +
      INDENT_LAST +
      '}'
  } else if (source && source[__PLIST_DATA_KEY__]) {
    res = stringify(source[__PLIST_DATA_KEY__])
  } else {
    res = stringify(source, null, indent)
  }

  return res
}

// prettier-ignore
export default (source: any, indent: number | string = 2): string =>
  __js2json__(
    source,
    !indent
      ? __EMPTY__
      : indent === +indent
        ? repeat(' ', indent)
        : __EMPTY__ + indent,
    0
  )
