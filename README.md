# plist2

Converts between .tmLanguage(.plist), .json, .cson and .yaml formats

### Disclaimer:

- The main task of this library is to work with `.plist`(`.tmLanguage`, `.tmTheme`) files. The native code is written to work with the `.plist`. It does not parse any `xml`, but only `plist`!
- To work with the `.cson`, a custom code was also written, therefore, it does not pull unnecessary dependencies.
- The library ignores some inaccuracies, but there is no complete validation.
- Spec `.plist` can contain tag `<data>some base64 content</data>`. See [spec](http://www.apple.com/DTDs/PropertyList-1.0.dtd). This library does not convert it to anything, but in the `JS/TS` files you will get such an object: `{ "%binary64%": 'some base64 content' }`. You can process it yourself.
- All comments (in `.list` and `.cson`) are placed in a hidden object `%comments%`. You won't see them when compiling to a `json` and `yaml`.
- To work with `.yaml` the [yaml](https://www.npmjs.com/package/yaml) library was used. But, the tag `!!binary "base64 code"` will be converted to `{ "%binary64%": 'base64 code' }` and vice versa. It will probably be possible to pass comments between `plist` and `yaml` in the future.

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
  js2cson,
  js2json,
  js2plist,
  js2yaml,
  // JSON
  json2cson,
  json2js,
  json2plist,
  json2yaml,
  // CSON
  cson2js,
  cson2json,
  cson2plist,
  cson2yaml,
  // PLIST
  plist2cson,
  plist2js,
  plist2json,
  plist2yaml,
  // YAML
  yaml2cson,
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
type js2cson = (js: any, indent: number | string = 2): string
type js2json = (js: any, indent: number | string = 2): string
type js2plist = (js: any, indent: number | string = 2): string
type js2yaml = (js: any, indent: number | string = 2): string
// JSON
type json2js = (json: string): any
type json2cson = (json: string, indent: number | string = 2): string
type json2plist = (json: string, indent: number | string = 2): string
type json2yaml = (json: string, indent: number | string = 2): string
// CSON
type cson2js = (json: string): any
type cson2json = (json: string, indent: number | string = 2): string
type cson2plist = (json: string, indent: number | string = 2): string
type cson2yaml = (json: string, indent: number | string = 2): string
// PLIST
type plist2js = (plist: string): any
type plist2cson = (plist: string, indent: number | string = 2): string
type plist2json = (plist: string, indent: number | string = 2): string
type plist2yaml = (plist: string, indent: number | string = 2): string
// YAML
type yaml2js = (yaml: string): any
type yaml2cson = (yaml: string, indent: number | string = 2): string
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
    <key>dataExample</key>
    <data>cGxpc3Qy</data>

    <!-- Comment example -->
    <key>dateExample</key>
    <date>2021-12-21T00:00:00Z</date>

    <key>  string1  </key>
    <string>  not trim this string and key  </string>

    <key>
      string2  </key>
    <string>  partially trim this string and key  
    </string>

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

    <key>numberInteger</key>
    <integer>234</integer>
    <key>numberFloat</key>
    <real>234.656</real>

    <key>incorrect values and tags (it will also work)</key>
    <array12345>
      <integer>234.23445</integer>
      </true>
      <FALSE>
    </ARRAY>

  </dict>
</plist>
`

const res = plist2js(sourcePlist)
console.log(res)
// Result:
expect(res).toEqual({
  // You have to deal with the `base64` data yourself
  dataExample: { '%binary64%': 'cGxpc3Qy' },
  dateExample: new Date('2021-12-21T00:00:00Z'),
  // not trim - if the tag is on the same line
  '  string1  ': '  not trim this string and key  ',
  // trim - if the tag was moved
  'string2  ': '  partially trim this string and key',
  array: ['foobar' /* %comments%: { 0: ['comment in tag'] } */],
  object: { key: 'value' },
  boolean: true,
  numberInteger: 234,
  numberFloat: 234.656,
  // Even the wrong data was processed
  'incorrect values and tags (it will also work)': [234, true, false],
  // This is a hidden object with comments.
  // It will not be displayed when converting to a `JSON` and `YAML`
  '%comments%': {
    dateExample: [' Comment example ']
  }
})

console.log(js2json(res)) // see below
console.log(js2cson(res)) // see below
```

Result json:

```json
{
  "dataExample": { "%binary64%": "cGxpc3Qy" },
  "dateExample": "2021-12-21T00:00:00.000Z",
  "  string1  ": "  not trim this string and key  ",
  "string2  ": "  partially trim this string and key",
  "array": ["foobar"],
  "object": { "key": "value" },
  "boolean": true,
  "numberInteger": 234,
  "numberFloat": 234.656,
  "incorrect values and tags (it will also work)": [234, true, false]
}
```

Result cson:

```cson
dataExample:
  '%binary64%': 'cGxpc3Qy'
#  Comment example
dateExample: '2021-12-21T00:00:00.000Z'
'  string1  ': '  not trim this string and key  '
'string2  ': '  partially trim this string and key'
array: [
  # comment in tag
  'foobar'
]
object:
  key: 'value'
boolean: true
numberInteger: 234
numberFloat: 234.656
'incorrect values and tags (it will also work)': [
  234
  true
  false
]
```

The `%comments%` are gone, and the document itself looks more compact.

## CLI:

If the library is installed globally:
[Here](https://github.com/wareset/plist2/tree/main/examples) you can see examples of the conversion.

```bash
# auto detect extnames: `json`, 'cson' and 'yaml' ('yml')
# other extnames will be recognized as a 'plist'

# plist2 [inputFile] [outputFile-or-extName]

# example yaml->plist
plist2 somefile.yaml somefile.plist # create somefile.plist

# or yaml->plist
plist2 somefile.YML-TEST tmLanguage # create somefile.YML-TEST.tmLanguage

# or plist->json
plist2 somefile.plist .json # create somefile.plist.json

# or json->yaml
plist2 somefile.json ./folder/newfile.yml # create ./folder/newfile.yml

# or json->cson
plist2 somefile.json /newfile.json.cson # create /newfile.json.cson
```

---

## Lisence

MIT
