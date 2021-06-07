import { parseDocument as yamlParseDocument } from 'yaml'
import { __BINARY64_KEY__ } from './lib'

const scanItems = (items?: any[]): void => {
  if (items) {
    items.forEach((value) => {
      if ((value = value.value)) {
        if (value.tag === 'tag:yaml.org,2002:binary') {
          value.value = { [__BINARY64_KEY__]: value.value.replace(/\s+/g, '') }
        } else scanItems(value.items)
      }
    })
  }
}

export default (source: string): any => {
  const yaml = yamlParseDocument(source)
  scanItems(yaml.contents && (yaml.contents as any).items)
  return yaml.toJSON()
}
