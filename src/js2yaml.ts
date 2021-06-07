import { changeYamlIndentOnString } from './lib'
import { stringify as yamlStringify } from 'yaml'

export default (source: any, indent: number | string = 2): string =>
  changeYamlIndentOnString(
    yamlStringify(source, { indent: indent === +indent ? indent : 2 }),
    indent
  )
