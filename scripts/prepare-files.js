const { copyFiles } = require('./copy-files-to-dist');
const { makePackageJSON, savePackageJSON } = require('./make-dist-package-json');

copyFiles(['README.md']).catch((e) => {
  console.error(e);
});

savePackageJSON(makePackageJSON(require('../package.json')));
