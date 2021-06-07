import cson2js from './cson2js'
import js2plist from './js2plist'

export default (source: string, indent: number | string = 2): string =>
  js2plist(cson2js(source), indent)
