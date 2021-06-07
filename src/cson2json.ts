import cson2js from './cson2js'
import js2json from './js2json'

export default (source: string, indent: number | string = 2): string =>
  js2json(cson2js(source), indent)
