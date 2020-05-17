#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const _ = require('lodash');
const { version } = require('../package.json');
const {
  generateRootCA,
  trustRootCA
} = require('node-proxymock');

program
.name(chalk.green('proxymock-ca'))
.usage(chalk.blue(' [-r] [-o] [-t]'))
.version(version, '-v, --version', chalk.blue('output the current version'))
.description('Welcome to use proxymock to mock data !')
.option('-r, --root', chalk.blue('generate root CA'))
.option('-o, --overwrite', chalk.blue('generate root CA with overwrite'))
.option('-t, --trust', chalk.blue('trust root CA'))
.helpOption('-h, --help', chalk.blue('display help for command'))
.action(_.debounce(async({ root, trust, overwrite }) => {
  root && generateRootCA(!!overwrite);
  trust && trustRootCA();
}))
.on('--help', () => {
  console.log('-------------------------------------------------------------------------');
  console.log('Examples:');
  console.log('$ %s %s', chalk.green('proxymock-ca'), chalk.blue('-r'));
  console.log('$ %s %s', chalk.green('proxymock-ca'), chalk.blue('-r -o'));
  console.log('$ %s %s', chalk.green('proxymock-ca'), chalk.blue('-t'));
  console.log('$ %s %s', chalk.green('pk-ca'), chalk.blue('-r'));
  console.log('$ %s %s', chalk.green('pk-ca'), chalk.blue('-r -o'));
  console.log('$ %s %s', chalk.green('pk-ca'), chalk.blue('-t'));
})
.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
