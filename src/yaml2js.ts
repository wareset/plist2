import { parse } from 'yaml'

export default (source: string): any => parse(source)
