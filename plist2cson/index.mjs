import js2cson from '../js2cson';
import plist2js from '../plist2js';

var plist2cson = (source, indent = 2) => js2cson(plist2js(source), indent);

export default plist2cson;
