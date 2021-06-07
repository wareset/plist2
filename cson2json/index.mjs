import cson2js from '../cson2js';
import js2json from '../js2json';

var cson2json = (source, indent = 2) => js2json(cson2js(source), indent);

export default cson2json;
