// https://www.apple.com/DTDs/PropertyList-1.0.dtd
/*
<!ENTITY % plistObject "(array | data | date | dict | real | integer | string | true | false )" >
<!ELEMENT plist %plistObject;>
<!ATTLIST plist version CDATA "1.0" >

<!-- Collections -->
<!ELEMENT array (%plistObject;)*>
<!ELEMENT dict (key, %plistObject;)*>
<!ELEMENT key (#PCDATA)>

<!--- Primitive types -->
<!ELEMENT string (#PCDATA)>
<!ELEMENT data (#PCDATA)> <!-- Contents interpreted as Base-64 encoded -->
<!ELEMENT date (#PCDATA)> <!-- Contents should conform to a subset of ISO 8601 (in particular, YYYY '-' MM '-' DD 'T' HH ':' MM ':' SS 'Z'.  Smaller units may be omitted with a loss of precision) -->

<!-- Numerical primitives -->
<!ELEMENT true EMPTY>  <!-- Boolean constant true -->
<!ELEMENT false EMPTY> <!-- Boolean constant false -->
<!ELEMENT real (#PCDATA)> <!-- Contents should represent a floating point number matching ("+" | "-")? d+ ("."d*)? ("E" ("+" | "-") d+)? where d is a digit 0-9.  -->
<!ELEMENT integer (#PCDATA)> <!-- Contents should represent a (possibly signed) integer number in base 10 -->
*/

import {
  __EMPTY__,
  // __PLIST__,
  __KEY__,
  __ARRAY__,
  __DICT__,
  __STRING__,
  __INTEGER__,
  __REAL__,
  __DATE__,
  __DATA__,
  __TRUE__,
  __FALSE__,
  __PLIST_COMMENTS_KEY__,
  __PLIST_DATA_KEY__
} from './lib'

import { keys, isArray, createArray, createObject } from './lib'

const normalizeValue = (v: string): string =>
  v
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")

export default (source: string): any => {
  const plist: any = createArray()

  let key = __EMPTY__
  let tag = __EMPTY__
  let content = __EMPTY__
  // prettier-ignore
  const clear = (): void => { tag = content = '' }

  let ENV: any = plist
  const superSet = (value: any): void => {
    if (isArray(ENV)) ENV.push(value)
    else (ENV[key] = value), (key = '')
  }

  const __env__: any[] = []
  const setEnv = (_type: null | any): void => {
    if (_type === null) {
      __env__.length && __env__.pop()
      ENV = __env__[__env__.length - 1]
    } else superSet(_type), __env__.push((ENV = _type))
  }

  const initTag = (_slash: any, _tag: string, _cb: () => void): void => {
    if (_slash) tag === _tag && _cb()
    else !tag && (tag = _tag)
  }

  const saveComment = (_comment: string): void => {
    _comment = _comment.slice(4, -3)
    const __comments__ = ENV[__PLIST_COMMENTS_KEY__]
    const id = isArray(ENV) ? ENV.length : key
    if (!(id in __comments__)) __comments__[id] = [_comment]
    else __comments__[id].push(_comment)
  }

  const saveKey = (): void => {
    ;(key = normalizeValue(content)), clear()
    if (__EMPTY__ in ENV[__PLIST_COMMENTS_KEY__]) {
      ENV[__PLIST_COMMENTS_KEY__][key] = ENV[__PLIST_COMMENTS_KEY__][__EMPTY__]
      delete ENV[__PLIST_COMMENTS_KEY__][__EMPTY__]
    }
  }
  // prettier-ignore
  const saveString = (): void => { superSet(normalizeValue(content)), clear() }
  // prettier-ignore
  const saveInteger = (): void => { superSet(parseInt(content)), clear() }
  // prettier-ignore
  const saveReal = (): void => { superSet(parseFloat(content)), clear() }
  // prettier-ignore
  const saveDate = (): void => { superSet(new Date(content.trim())), clear() }
  // prettier-ignore
  const saveData = (): void =>
  { superSet({ [__PLIST_DATA_KEY__]: content.trim() }), clear() }
  // prettier-ignore
  const saveBoolean = (bool: boolean): void => { !tag && superSet(bool) }

  source.replace(
    /(<!--.*?-->)|(?:<)(\/)?(array|dict|key|string|integer|real|dat(?:e|a)|true|false)(?:.*?>)|([^<]+)/gi,
    (_, _comment, _slash, _tag, _content, _index) => {
      switch (false) {
        case !_comment:
          saveComment(_comment)
          break
        case !_tag:
          _tag = _tag.toLowerCase()
          switch (_tag) {
            case __ARRAY__:
              setEnv(_slash ? null : createArray())
              break
            case __DICT__:
              setEnv(_slash ? null : createObject())
              break

            case __KEY__:
              initTag(_slash, __KEY__, saveKey)
              break

            case __STRING__:
              initTag(_slash, __STRING__, saveString)
              break
            case __INTEGER__:
              initTag(_slash, __STRING__, saveInteger)
              break
            case __REAL__:
              initTag(_slash, __REAL__, saveReal)
              break
            case __DATE__:
              initTag(_slash, __DATE__, saveDate)
              break
            case __DATA__:
              initTag(_slash, __DATA__, saveData)
              break

            case __TRUE__:
              saveBoolean(true)
              break
            case __FALSE__:
              saveBoolean(false)
              break
          }
          break
        case !_content:
          tag && (content += _content)
          break
      }

      return __EMPTY__
    }
  )

  let res = plist

  if (plist.length === 1) {
    res = plist[0]

    keys(plist[__PLIST_COMMENTS_KEY__]).forEach((key: string) => {
      if (!res[__PLIST_COMMENTS_KEY__][key]) {
        res[__PLIST_COMMENTS_KEY__][key] = plist[__PLIST_COMMENTS_KEY__][key]
      } else {
        res[__PLIST_COMMENTS_KEY__][key][
          key !== __EMPTY__ ? 'unshift' : 'push'
        ](...plist[__PLIST_COMMENTS_KEY__][key])
      }
    })
  }

  return res
}
