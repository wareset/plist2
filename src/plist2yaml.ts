import { stringify } from 'yaml'
import plist2js from './plist2js'

export default (source: string, indent = 2): string =>
  stringify(plist2js(source), { indent })
