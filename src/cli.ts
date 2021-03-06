/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs'
import path from 'path'

import { cson2js, js2cson } from '.'
import { json2js, js2json } from '.'
import { plist2js, js2plist } from '.'
import { yaml2js, js2yaml } from '.'
import {
  cson2json,
  cson2plist,
  cson2yaml,
  json2cson,
  json2plist,
  json2yaml,
  plist2cson,
  plist2json,
  plist2yaml,
  yaml2cson,
  yaml2json,
  yaml2plist
} from '.'

const regex = /^\.((?:j|c)son|ya?ml).*/i
const getExt = (v: string): string => {
  const ext = path.extname(v) || '.' + path.basename(v)
  const file = (ext.match(regex) || ['', 'plist'])[1].toLowerCase()
  // console.log('ext: ' + ext, file)
  return file === 'yml' ? 'yaml' : file
}

let input = process.argv[2] || ''
let output = process.argv[3] || ''

if (!input) console.error('ERROR: Need to specify the "input" file')
else if (!output)
  console.error('ERROR: Need to specify the "output" file or ext')
else {
  input = path.resolve(input)
  output = path.resolve(output)
  const bn = path.basename(output)
  if (!path.extname(output) || !bn)
    output = input + (bn[0] === '.' ? '' : '.') + bn

  // console.log(input)
  // console.log(output)

  const inputExt = getExt(input)
  const outputExt = getExt(output)
  // console.log(inputExt)
  // console.log(outputExt)

  let parser: Function
  switch (inputExt + '2' + outputExt) {
    case 'cson2json':
      parser = cson2json
      break
    case 'cson2plist':
      parser = cson2plist
      break
    case 'cson2yaml':
      parser = cson2yaml
      break
    case 'cson2cson':
      parser = (source: string): string => js2cson(cson2js(source))
      break

    case 'json2cson':
      parser = json2cson
      break
    case 'json2plist':
      parser = json2plist
      break
    case 'json2yaml':
      parser = json2yaml
      break
    case 'json2json':
      parser = (source: string): string => js2json(json2js(source))
      break

    case 'plist2cson':
      parser = plist2cson
      break
    case 'plist2json':
      parser = plist2json
      break
    case 'plist2yaml':
      parser = plist2yaml
      break
    case 'plist2plist':
      parser = (source: string): string => js2plist(plist2js(source))
      break

    case 'yaml2cson':
      parser = yaml2cson
      break
    case 'yaml2json':
      parser = yaml2json
      break
    case 'yaml2plist':
      parser = yaml2plist
      break
    case 'yaml2yaml':
      parser = (source: string): string => js2yaml(yaml2js(source))
      break
    default:
      throw new Error()
  }

  if (!parser)
    console.error(
      'ERROR: "' + inputExt + '" and "' + outputExt + '" - not work'
    )
  else {
    try {
      fs.mkdirSync(path.dirname(output), { recursive: true })
      fs.writeFileSync(output, parser(fs.readFileSync(input, 'utf8')))
    } catch (e) {
      console.error(e)
    }
  }
}
