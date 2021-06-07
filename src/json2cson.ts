import { jsonParse } from './lib'
import js2cson from './js2cson'

export default (source: string, indent: number | string = 2): string =>
  js2cson(jsonParse(source), indent)
