import js2cson from './js2cson'
import plist2js from './plist2js'

export default (source: string, indent: number | string = 2): string =>
  js2cson(plist2js(source), indent)
