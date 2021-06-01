import { stringify } from 'yaml'

export default (source: string, indent = 2): any =>
  stringify(JSON.parse(source), { indent })
