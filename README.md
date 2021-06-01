# plist2

Converts between .tmLanguage(.plist), .json and .yaml formats

### Disclaimer:

- The main task of this library is to work with `.plist`(`.tmLanguage`, `.tmTheme`) files. The native code is written to work with the `.plist`. It does not parse any `xml`, but only `plist`!
- The library ignores some inaccuracies, but there is no complete validation.
- Spec `.plist` can contain tag `<data>some base64 content</data>`. See [spec](http://www.apple.com/DTDs/PropertyList-1.0.dtd). This library does not convert it to anything, but in the `JS/TS` files you will get such an object: `{ __plistData__: 'some base64 content' }`. You can process it yourself.
- All comments are placed in a hidden object `__plistComments__`. You won't see them when compiling to a `json` and `yaml`.
- To work with `.yaml` the [yaml](https://www.npmjs.com/package/yaml) library was used. It will probably be possible to pass comments between `plist` and `yaml` in the future.

---

## Usage:

### Install:

```bash
npm i plist2 # yarn add plist2
# or globally (the library has CLI):
npm i -g plist2
```

### Use in js/ts:

```js
import {
  // JS
  js2json,
  js2plist,
  js2yaml
  // JSON
  json2js,
  json2plist,
  json2yaml,
  // PLIST
  plist2js,
  plist2json,
  plist2yaml,
  // YAML
  yaml2js,
  yaml2json,
  yaml2plist
} from 'plist2'

// or
import js2json from 'plist2/js2json' // and other ...

// or
const js2json = require('plist2').js2json // and other ...

// or
const js2json = require('plist2/js2json').default // and other ...
```

Function types (typescript):

```ts
// JS
type js2json = (js: any, indent: number | string = 2): string
type js2plist = (js: any, indent: number | string = 2): string
type js2yaml = (js: any, indent: number = 2): string
// JSON
type json2js = (json: string): any
type json2plist = (json: string, indent: number | string = 2): string
type json2yaml = (json: string, indent: number = 2): string
// PLIST
type plist2js = (plist: string): any
type plist2json = (plist: string, indent: number | string = 2): string
type plist2yaml = (plist: string, indent: number = 2): string
// YAML
type yaml2js = (yaml: string): any
type yaml2json = (yaml: string, indent: number | string = 2): string
type yaml2plist = (yaml: string, indent: number | string = 2): string
```

### Example:

```js
const sourcePlist = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>data-example</key>
    <data>cGxpc3Qy</data>

    <!-- Comment example -->
    <key>date</key>
    <date>2021-12-21T00:00:00Z</date>

    <key>array</key>
    <array>
      <string>foo<!--comment in tag-->bar</string>
    </array>

    <key>object</key>
    <dict>
      <key>key</key>
      <string>value</string>
    </dict>

    <key>boolean</key>
    <true/>

    <key>number-integer</key>
    <integer>234</integer>
    <key>number-float</key>
    <real>234.656</real>

    <key>incorrect values and tags (it will also work)</key>
    <array12345>
      <integer>234.23445</integer>
      <true>
      <TRUE/>
      <FaLsE/>
    </ARRAY>

  </dict>
</plist>
`

const res = plist2js(sourcePlist)
console.log(res)
// Result:
expect(res).toEqual({
  // You have to deal with the `base64` data yourself
  'data-example': { __plistData__: 'cGxpc3Qy' },

  date: new Date('2021-12-21T00:00:00Z'),

  array: ['foobar' /* __plistComments__: { 0: ['comment in tag'] } */],

  object: { key: 'value' },

  boolean: true,

  'number-integer': 234,
  'number-float': 234.656,

  // Even the wrong data was processed
  'incorrect values and tags (it will also work)': [234, true, true, false],

  // This is a hidden object with comments.
  // It will not be displayed when converting to a `JSON` and `YAML`
  __plistComments__: {
    date: [' Comment example ']
  }
})
```

---

## CLI:

If the library is installed globally:

```bash
# auto detect extnames: `json`, 'yaml', 'yml'
# other extnames will be recognized as a 'plist'

# plist2 [inputFile] [outputFile-or-extName]

# example yaml->plist
plist2 somefile.yaml somefile.plist # create somefile.plist

# or yaml->plist
plist2 somefile.YML-TEST tmLanguage # create somefile.yml-some.tmLanguage

# or plist->json
plist2 somefile.plist json # create somefile.plist.json

# or json->yaml
plist2 somefile.json ./folder/newfile.yml # create ./folder/newfile.yml
```

[Here](https://github.com/wareset/plist2/tree/main/examples) you can see examples of the conversion.

---

## Lisence

MIT
