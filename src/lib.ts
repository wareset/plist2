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

export const __PLIST_COMMENTS_KEY__ = '__plistComments__'
export const __PLIST_DATA_KEY__ = '__plistData__'

const Obj = Object

export const keys = Obj.keys

const setComments = <T>(v: T): T => (
  Obj.defineProperty(v, __PLIST_COMMENTS_KEY__, {
    enumerable: false,
    value: {}
  }),
  v
)

const create = Obj.create
export const createArray = (): any => setComments([])
export const createObject = create
  ? (): any => setComments(create(null))
  : (): any => setComments({})

const getPrototypeOf = Obj.getPrototypeOf || ((v: any): any => v.__proto__)
export const isArray = Array.isArray
export const isObject = (v: any): boolean =>
  v != null &&
  !v[__PLIST_DATA_KEY__] &&
  (!(v = getPrototypeOf(v)) || v.constructor === Obj)

export const stringify = JSON.stringify

export const setIndent = (indent: string, deep: number): string =>
  !indent ? '' : indent.repeat(deep > 0 ? deep : 0)
