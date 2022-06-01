const {readFile} = require('fs').promises;
const {watch} = require('chokidar');
const {normalize, join, resolve, extname} = require('path');

function safeJoin(base, target) {
  const targetPath = '.' + normalize('/' + target);
  return resolve(base, targetPath);
}

const userPath = safeJoin(__dirname, process.argv[2]);

watch(userPath, {
  awaitWriteFinish: true
})
  .on('add', (path) => console.log(`File ${path} has been added`))
  .on('unlink', (path) => console.log(`File ${path} has been deleted`))
  .on('change', (path) => {
    console.log(`File ${path} has been chabged`);
    if (extname(path).toLowerCase() === '.js') {
      (async () => {
        const data = await readFile(path, {
          encoding: 'utf8',
        });
        console.log(data);
      })();
    }
  });
