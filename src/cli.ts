/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs'
import path from 'path'

const getExt = (v: string): string => {
  const ext = path.extname(v) || '.' + path.basename(v)
  const file = (/^\.(json|ya?ml).*/i.exec(ext) || [
    '',
    'plist'
  ])[1].toLowerCase()
  // console.log('ext: ' + ext, file)
  return file === 'yml' ? 'yaml' : file
}

let input = process.argv[2] || ''
let output = process.argv[3] || ''
if (!input) throw new Error('Need "input" file')
if (!output) throw new Error('Need "output" file or ext')

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

import { json2js, js2json } from '.'
import { plist2js, js2plist } from '.'
import { yaml2js, js2yaml } from '.'
import {
  json2plist,
  json2yaml,
  plist2json,
  plist2yaml,
  yaml2json,
  yaml2plist
} from '.'

let parser!: Function
switch (inputExt + '2' + outputExt) {
  case 'json2plist':
    parser = json2plist
    break
  case 'json2yaml':
    parser = json2yaml
    break
  case 'json2json':
    parser = (source: string): string => js2json(json2js(source))
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
    throw new Error('"' + inputExt + '" and "' + outputExt + '" - not work')
}

try {
  fs.mkdirSync(path.dirname(output), { recursive: true })
} catch (e) {
  if (e.code !== 'EEXIST') throw e
}
const res = parser(fs.readFileSync(input, 'utf8'))
fs.writeFileSync(output, res)
