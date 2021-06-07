import yaml2js from './yaml2js'
import js2cson from './js2cson'

export default (source: string, indent: number | string = 2): any =>
  js2cson(yaml2js(source), indent)
