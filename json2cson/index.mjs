import { jsonParse } from '../lib';
import js2cson from '../js2cson';

var json2cson = (source, indent = 2) => js2cson(jsonParse(source), indent);

export default json2cson;
