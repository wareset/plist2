import { parse } from 'yaml'
import js2plist from './js2plist'

export default (source: string, indent?: number | string): any =>
  js2plist(parse(source), indent)
