const program = require('commander');
const chalk = require('chalk');
const { version } = require('./package.json');

program
.name(chalk.green('proxymock'))
.usage(chalk.blue('-d') + chalk.yellow(' <mock data directory>') + chalk.blue(' [-w]'))
.version(version, '-v, --version', chalk.blue('output the current version'))
// .command('proxymock')
// .alias('pk')
.description('Welcome to use proxymock to mock data !')
.option('-d, --dir <directory path>', chalk.blue('setup mock data directory'))
.option('-w, --watch', chalk.blue('watch files changing in mock data directory'))
.helpOption('-h, --help', chalk.blue('display help for command'))
// 执行的操作
.action(function(cmd, options) {
  // 参数可以拿到
  // console.log(Array.prototype.slice.call(arguments, 1));
})
// 自定义help信息
.on('--help', () => {
  console.log('-------------------------------------------------------------------------');
  console.log('Examples:');
  console.log('$ %s %s %s %s', chalk.green('proxymock'), chalk.blue('-d'), chalk.yellow('/home/mockdata'), chalk.blue(' -w'));
  console.log('$ %s %s %s %s', chalk.green('pk'), chalk.blue('-d'), chalk.yellow('/home/mockdata'), chalk.blue(' -w'));
})
.parse(process.argv);


// 参数长度不够, 打印帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// 解析命令行参数
program.parse(process.argv);
