import { jsonParse } from './lib'
import { changeYamlIndentOnString } from './lib'
import { stringify as yamlStringify } from 'yaml'

export default (source: string, indent: number | string = 2): any =>
  changeYamlIndentOnString(
    yamlStringify(jsonParse(source), {
      indent: indent === +indent ? indent : 2
    }),
    indent
  )
