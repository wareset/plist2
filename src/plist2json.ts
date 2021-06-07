import js2json from './js2json'
import plist2js from './plist2js'

export default (source: string, indent: number | string = 2): string =>
  js2json(plist2js(source), indent)
