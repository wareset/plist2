import js2plist from './js2plist'

export default (source: string, indent?: number | string): string =>
  js2plist(JSON.parse(source), indent)
