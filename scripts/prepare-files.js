const { copyFiles } = require('@osnova/build-library');
const { makePackageJSON, savePackageJSON } = require('@osnova/build-library');

copyFiles(['README.md']).catch((e) => {
  console.error(e);
});

savePackageJSON(makePackageJSON(require('../package.json')));
