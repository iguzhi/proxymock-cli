var Module = module.constructor;
var m = new Module();
var code = 'module.exports = function () {console.log("abc");}';
m._compile(code, 'first.js');
var a = m.exports;
a();
