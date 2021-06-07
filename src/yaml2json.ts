import yaml2js from './yaml2js'
import js2json from './js2json'

export default (source: string, indent: number | string = 2): any =>
  js2json(yaml2js(source), indent)
