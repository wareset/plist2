/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable security/detect-non-literal-regexp */

export const __EMPTY__ = ''
// plist | key
// array | data | date | dict | real | integer | string | true | false
export const __PLIST__ = 'plist'
export const __KEY__ = 'key'
export const __ARRAY__ = 'array'
export const __DICT__ = 'dict'
export const __STRING__ = 'string'
export const __INTEGER__ = 'integer'
export const __REAL__ = 'real'
export const __DATE__ = 'date'
export const __DATA__ = 'data'
export const __TRUE__ = 'true'
export const __FALSE__ = 'false'

export const __COMMENTS_KEY__ = '%comments%'
export const __BINARY64_KEY__ = '%binary64%'

const Obj = Object

export const REG_CRLF = '[\\r\\n\\u2028\\u2029]'
export const regexp = (pattern: (string | RegExp)[], flags: string): RegExp =>
  new RegExp(pattern.map((v: any) => v.source || v).join(__EMPTY__), flags)

export const keys = Obj.keys

export const repeat = (string: string, count?: number): string => {
  let res = __EMPTY__
  count = -~count! || 0
  while (--count > 0) res += string
  return res
}

export const setComments = <T>(v: T, value = {}): T => (
  Obj.defineProperty(v, __COMMENTS_KEY__, {
    configurable: true,
    enumerable: false,
    writable: true,
    value
  }),
  v
)

const create = Obj.create
export const createArray = (): any => setComments([], [])
export const createObject = create
  ? (): any => setComments(create(null))
  : (): any => setComments({})

const getPrototypeOf = Obj.getPrototypeOf || ((v: any): any => v.__proto__)
export const isArray = Array.isArray
export const isObject = (v: any): boolean =>
  v != null &&
  // !v[__BINARY64_KEY__] &&
  (!(v = getPrototypeOf(v)) || v.constructor === Obj)

export const jsonStringify = JSON.stringify
export const jsonParse = JSON.parse

export const setIndent = (indent: string, deep: number): string =>
  !indent ? '' : repeat(indent, deep)

// prettier-ignore
export const changeYamlIndentOnString = (
  yaml: string,
  indent: string | number
): string => (
  (yaml = yaml.trim().replace(/[\r\n\u2028\u2029]\s*"%binary64%":\s*/g, ' !!binary ')),
  indent === +indent
    ? yaml
    : yaml.replace(
      /(^|\r\n?|\n|\u2028|\u2029)( {2,2})+/g,
      (_, n, s) => n + repeat(indent as string, s.length / 2)
    )
)
