//main.js
const fs = require('fs')
const NativeModule = require('module')
const vm = require('vm')

fs.readFile = util.promisify(fs.readFile)
const bundle = await fs.readFile('./bundle.js', 'utf-8') //此时的bundle为String

const getModuleFromString = (bundle, filename) => {
	const m = { exports: {} }
	const wrapper = NativeModule.wrap(bundle)
	const script = new vm.Script(wrapper, {
		filename,
		displayErrors: true
	})
	const result = script.runInThisContext() // 此处可以指定代码的执行环境，此api在nodejs文档中有介绍
	result.call(m.exports, m.exports, require, m) // 执行wrapper函数，此处传入require就解决了第一种方法不能require的问题
	return m
}

const m = getModuleFromString(bundle, 'bundle.js')
