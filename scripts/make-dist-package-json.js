const fs = require('fs');
const path = require('path');

const skipEntries = ['devDependencies', 'publishConfig', 'scripts'];

module.exports.makePackageJSON = function makePackageJSON(originalPackageJSONContent) {
  const resultPkg = {};

  Object.entries(originalPackageJSONContent).forEach(([name, value]) => {
    if (skipEntries.includes(name)) {
      return;
    }

    if (name === 'files') {
      resultPkg[name] = ['*'];
    } else if (name === 'main' || name === 'module' || name === 'browser' || name === 'types') {
      resultPkg[name] = value.replace('dist/', '');
    } else {
      resultPkg[name] = value;
    }
  });

  return resultPkg;
};

module.exports.savePackageJSON = function savePackageJSON(content) {
  fs.writeFileSync(path.resolve(__dirname, '../dist/package.json'), JSON.stringify(content, undefined, 2), {
    encoding: 'utf-8',
  });
};
