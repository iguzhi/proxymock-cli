const chokidar = require('chokidar');
const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('proxymock:cli');
const { proxyMock, parseRegExpRule, getState } = require('node-proxymock');
const { getChangedFileContent, getAddedFileContent } = require('./lib/utils');
const { parseRule, getRuleKey } = require('./lib/parser');

const log = console.log.bind(console);

function startProxyMock(dir, systemProxy, logLevel) {
  const watcher = chokidar.watch(
    path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir),
    {
      // ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    }
  );

  watcher
  .on('add', filepath => addRule(filepath))
  .on('change', filepath => updateRule(filepath))
  .on('unlink', filepath => removeRule(filepath));

  proxyMock({
    rules: {},
    setSystemProxy: systemProxy,
    logLevel: logLevel || 'info'
  });
}

async function addRule(filepath) {
  const { rules, regExpRules } = getState();
  const content = await getAddedFileContent(filepath);
  // log(chalk.green('[proxymock]'), chalk.blue('file'), chalk.yellow(filepath), chalk.blue('added to watch.'));

  if (!content) {
    return;
  }

  const { key, rule, disable } = parseRule(content, filepath);
  debug('addRule: key', key);
  debug('addRule: rule', rule);
  debug('addRule: disable', disable);
  if (key && rule && !disable) {
    log(chalk.green('[proxymock]'), chalk.blue('rule'), chalk.yellow(key), chalk.blue('added.'));
    const regExpRule = parseRegExpRule(key, rule);
    if (regExpRule) {
      regExpRules[key] = regExpRule;
    }
    else {
      rules[key] = rule;
    }
  }
  debug('rules', rules);
}

async function updateRule(filepath) {
  const { rules, regExpRules } = getState();
  const changedContent = await getChangedFileContent(filepath);

  if (!changedContent) {
    return;
  }

  // log(chalk.green('[proxymock]'), chalk.blue('file'), chalk.yellow(filepath), chalk.blue('updated.'));
  const { key, oldKey, rule, disable } = parseRule(changedContent, filepath);
  debug('updateRule: key', key);
  debug('updateRule: rule', rule);
  debug('updateRule: disable', disable);
  if (key) {
    if (disable) {
      delete rules[key];
      delete regExpRules[key];
      log(chalk.red('[proxymock]'), chalk.red('rule'), chalk.yellow(key), chalk.red('removed.'));
    }
    else if (rule) {
      if (oldKey && oldKey !== key) {
        delete rules[oldKey];
        delete regExpRules[oldKey];
        log(chalk.red('[proxymock]'), chalk.red('rule'), chalk.yellow(oldKey), chalk.red('removed.'));
        
        const regExpRule = parseRegExpRule(key, rule);
        if (regExpRule) {
          regExpRules[key] = regExpRule;
        }
        else {
          rules[key] = rule;
        }
        log(chalk.green('[proxymock]'), chalk.blue('rule'), chalk.yellow(key), chalk.blue('added.'));
      }
      else {
        log(chalk.green('[proxymock]'), chalk.blue('rule'), chalk.yellow(key), chalk.blue(rules[key] || regExpRules[key] ? 'updated.' : 'added.'));
        
        const regExpRule = parseRegExpRule(key, rule);
        if (regExpRule) {
          regExpRules[key] = regExpRule;
        }
        else {
          rules[key] = rule;
        }
      }
    }
  }
}

function removeRule(filepath) {
  const { rules, regExpRules } = getState();
  // log(chalk.red('[proxymock]'), chalk.red('file'), chalk.yellow(filepath), chalk.red('removed.'));
  const key = getRuleKey(filepath);

  if (key) {
    delete rules[key];
    delete regExpRules[key];
    log(chalk.red('[proxymock]'), chalk.red('rule'), chalk.yellow(key), chalk.red('removed.'));
  }
}

module.exports = startProxyMock;
