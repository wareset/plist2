import {
  keys,
  repeat,
  isArray,
  isObject,
  setIndent,
  __EMPTY__,
  __ARRAY__,
  __DICT__,
  __KEY__,
  __STRING__,
  __INTEGER__,
  __REAL__,
  __DATE__,
  __DATA__,
  __COMMENTS_KEY__,
  __BINARY64_KEY__
} from './lib'

const normalizeString = (value: any): string =>
  (__EMPTY__ + value).trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
// .replace(/"/gi, '&quot;')
// .replace(/'/gi, '&apos;')

const wrapValue = (tag: string, value: any, concise?: boolean): string =>
  concise ? `<${value}/>` : `<${tag}>${value}</${tag}>`

// prettier-ignore
const writeComments = (comment: any, indent: string, newline: string): string =>
  !comment
    ? ''
    : (isArray(comment) ? comment : [comment])
      .map((v) => indent + `<!--${v}-->` + newline)
      .join(__EMPTY__)

const __js2plist__ = (source: any, indent: string, deep: number): string => {
  deep++
  const INDENT = setIndent(indent, deep)
  const NEW_LINE = indent ? '\n' : __EMPTY__
  const INDENT2 = setIndent(indent, deep + 1)

  let res = __EMPTY__
  if (isArray(source)) {
    const comments: any = { ...(source as any)[__COMMENTS_KEY__] || {} }

    source.forEach((v, k) => {
      res += writeComments(comments[k], INDENT2, NEW_LINE)
      res += __js2plist__(v, indent, deep)
    })

    res += writeComments(comments[__EMPTY__], INDENT2, NEW_LINE)
    res =
      '<' + __ARRAY__ + '>' + NEW_LINE + res + INDENT + '</' + __ARRAY__ + '>'
  } else if (typeof source === 'number') {
    res = wrapValue(
      source === parseInt('' + source, 10) ? __INTEGER__ : __REAL__,
      source
    )
  } else if (typeof source === 'boolean') {
    res = wrapValue(__EMPTY__, source, true)
  } else if (source instanceof Date) {
    res = wrapValue(__DATE__, source.toISOString())
  } else if (source && source[__BINARY64_KEY__]) {
    res = wrapValue(__DATA__, source[__BINARY64_KEY__])
  } else if (isObject(source)) {
    const comments: any = { ...(source as any)[__COMMENTS_KEY__] || {} }

    keys(source).forEach((k) => {
      if (k !== __COMMENTS_KEY__) {
        res += writeComments(comments[k], INDENT2, NEW_LINE)
        res += INDENT2 + wrapValue(__KEY__, normalizeString(k)) + NEW_LINE
        res += __js2plist__(source[k], indent, deep)
      }
    })

    res += writeComments(comments[__EMPTY__], INDENT2, NEW_LINE)
    res = '<' + __DICT__ + '>' + NEW_LINE + res + INDENT + '</' + __DICT__ + '>'
  } else {
    res = wrapValue(__STRING__, normalizeString(source))
  }

  return INDENT + res + NEW_LINE
}

// prettier-ignore
export default (source: string, indent: number | string = 2): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    __js2plist__(
      source,
      !indent
        ? __EMPTY__
        : indent === +indent
          ? repeat(' ', indent)
          : __EMPTY__ + indent,
      0
    ) + '</plist>'
  ].join(indent ? '\n' : __EMPTY__)
