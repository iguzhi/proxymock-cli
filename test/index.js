const chokidar = require('chokidar');
const path = require('path');

const watcher = chokidar.watch(path.resolve(__dirname, '.'), {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
.on('add', path => log(`File ${path} has been added`))
.on('change', (path, stats) => log(`File ${path} has been changed`, stats))
.on('unlink', path => log(`File ${path} has been removed`));