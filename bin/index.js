#!/usr/bin/env node

const os = require('os');
const program = require('commander');
const chalk = require('chalk');
const _ = require('lodash');
const { version } = require('../package.json');
const {
  generateRootCA,
  getCAStatus,
  trustRootCA
} = require('node-proxymock');
const startProxyMock = require('../');

const { exist } = getCAStatus();

if (!exist) {
  console.warn(chalk.cyan('[proxymock]'), 'root CA is not exists, your can generate one root CA to run - "proxymock-ca -r", and then');
  if (platform === 'darwin') {
    console.warn(' > run - "proxymock-ca -t" to trust the root CA')
  }
  if (/^win/.test(process.platform)) {
    console.warn(' > import it into system CA file list to trust the root CA manually');
  }
}

program
.name(chalk.green('proxymock'))
.usage(chalk.blue('-d') + chalk.yellow(' <mock data directory>') + chalk.blue(' [-s] [-l <log level>]'))
.version(version, '-v, --version', chalk.blue('output the current version'))
.description('Welcome to use proxymock to mock data !')
.option('-d, --dir <mock data directory>', chalk.blue('setup mock data directory'))
.option('-s, --system-proxy', chalk.blue('set system proxy'))
.option('-l, --log-level <log level>', chalk.blue('set log level'))
.helpOption('-h, --help', chalk.blue('display help for command'))
.action(_.debounce(({ dir, systemProxy = false, logLevel }) => {
  startProxyMock(dir, systemProxy, logLevel);
}))
.on('--help', () => {
  console.log('-------------------------------------------------------------------------');
  console.log('Examples:');
  console.log('$ %s %s %s %s', chalk.green('proxymock'), chalk.blue('-d'), chalk.yellow('/home/mockdata'), chalk.blue(' -s'));
  console.log('$ %s %s %s %s', chalk.green('pk'), chalk.blue('-d'), chalk.yellow('/home/mockdata'), chalk.blue(' -s'));
})
.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
