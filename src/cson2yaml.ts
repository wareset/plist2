import cson2js from './cson2js'
import js2yaml from './js2yaml'

export default (source: string, indent: number | string = 2): any =>
  js2yaml(cson2js(source), indent)
