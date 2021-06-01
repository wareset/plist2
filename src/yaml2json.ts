import { parse } from 'yaml'
import js2json from './js2json'

export default (source: string, indent?: number | string): any =>
  js2json(parse(source), indent)
