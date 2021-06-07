import cson2js from '../cson2js';
import js2yaml from '../js2yaml';

var cson2yaml = (source, indent = 2) => js2yaml(cson2js(source), indent);

export default cson2yaml;
