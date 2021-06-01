import { stringify } from 'yaml'

export default (source: string, indent = 2): string =>
  stringify(source, { indent })
