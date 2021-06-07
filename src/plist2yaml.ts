import plist2js from './plist2js'
import js2yaml from './js2yaml'

export default (source: string, indent: number | string = 2): string =>
  js2yaml(plist2js(source), indent)
