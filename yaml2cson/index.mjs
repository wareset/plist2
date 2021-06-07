import yaml2js from '../yaml2js';
import js2cson from '../js2cson';

var yaml2cson = (source, indent = 2) => js2cson(yaml2js(source), indent);

export default yaml2cson;
