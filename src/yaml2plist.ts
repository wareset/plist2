import yaml2js from './yaml2js'
import js2plist from './js2plist'

export default (source: string, indent: number | string = 2): any =>
  js2plist(yaml2js(source), indent)
