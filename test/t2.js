//main.js
const fs = require('fs')
fs.readFile = util.promisify(fs.readFile)
const bundle = await fs.readFile('./bundle.js', 'utf-8') //此时的bundle为String
const m = new module.constructor()
m._compile(bundle, 'bundle.js') // 第一个参数为要执行的代码字符串，第二个参数为文件名
//此时就可以通过m.exports来调用bundle.js文件中exports出来的东西
