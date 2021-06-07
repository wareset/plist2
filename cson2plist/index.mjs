import cson2js from '../cson2js';
import js2plist from '../js2plist';

var cson2plist = (source, indent = 2) => js2plist(cson2js(source), indent);

export default cson2plist;
