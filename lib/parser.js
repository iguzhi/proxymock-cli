const NativeModule = require('module');
const vm = require('vm');
const path = require('path');
const debug = require('debug')('proxymock:cli');

const filepathToKey = Object.create(null);

const rProxyMock = /\/\/\s*proxymock(?:-disable)?\s*:\s*[^\r\n]+/ig;
const rProxyMockField = /\/\/\s*(proxymock(?:-disable)?)\s*:\s*([^\r\n]+)/i;

function parseRule(content, filepath) {
  const list = content.match(rProxyMock);
  debug(list);
  let key, oldKey, disable = false, rule;
  list && list.forEach(s => {
    const l = s.match(rProxyMockField);
    const k = l[1].toLowerCase(), v = l[2];
    if (k === 'proxymock') {
      key = v;
    }
    else if (k === 'proxymock-disable') {
      if (v === 'true') {
        disable = true;
      }
      else if (v === 'false') {
        disable = false;
      }
    }
  });
  debug('key', key);
  debug('disable', disable);

  if (key) {
    oldKey = filepathToKey[filepath];
    // map filepath to key
    filepathToKey[filepath] = key;
    // reload module of filepath
    if (!disable) {
      const { name, ext } = path.parse(filepath);
      const filename = name + '.' + ext;
      const m = getModuleFromString(content, filename);
      rule = m.exports;
    }
  }
  debug('rule', rule);
  return { key, oldKey, disable, rule };
}

function getRuleKey(filepath) {
  return filepathToKey[filepath];
}

function getModuleFromString(bundle, filename) {
	const m = { exports: {} };
	const wrapper = NativeModule.wrap(bundle);
	const script = new vm.Script(wrapper, {
		filename,
		displayErrors: true
	});
	const result = script.runInThisContext(); // 此处可以指定代码的执行环境
	result.call(m.exports, m.exports, require, m); // 执行wrapper函数，此处传入require就解决了不能require的问题
	return m;
}

module.exports = {
  parseRule,
  getRuleKey
};
