const chokidar = require('chokidar');
const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('proxymock:cli');
const { proxyMock } = require('node-proxymock');
const { getChangedFileContent, getAddedFileContent } = require('./lib/utils');
const { parseRule, getRuleKey } = require('./lib/parser');

const log = console.log.bind(console);

const rules = Object.create(null);

function startProxyMock(dir, systemProxy) {
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
    rules,
    setSystemProxy: systemProxy
  });
}

async function addRule(filepath) {
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
    rules[key] = rule;
    log(chalk.green('[proxymock]'), chalk.blue('rule'), chalk.yellow(key), chalk.blue('added.'));
  }
  debug('rules', rules);
}

async function updateRule(filepath) {
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
      log(chalk.red('[proxymock]'), chalk.red('rule'), chalk.yellow(key), chalk.red('removed.'));
    }
    else if (rule) {
      if (oldKey && oldKey !== key) {
        delete rules[oldKey];
        log(chalk.red('[proxymock]'), chalk.red('rule'), chalk.yellow(oldKey), chalk.red('removed.'));
        rules[key] = rule;
        log(chalk.green('[proxymock]'), chalk.blue('rule'), chalk.yellow(key), chalk.blue('added.'));
      }
      else {
        log(chalk.green('[proxymock]'), chalk.blue('rule'), chalk.yellow(key), chalk.blue(rules[key] ? 'updated.' : 'added.'));
        rules[key] = rule;
      }
    }
  }
}

function removeRule(filepath) {
  // log(chalk.red('[proxymock]'), chalk.red('file'), chalk.yellow(filepath), chalk.red('removed.'));
  const key = getRuleKey(filepath);

  if (key) {
    delete rules[key];
    log(chalk.red('[proxymock]'), chalk.red('rule'), chalk.yellow(key), chalk.red('removed.'));
  }
}

module.exports = startProxyMock;
