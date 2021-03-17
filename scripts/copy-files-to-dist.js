const fs = require('fs');
const path = require('path');

module.exports.copyFiles = function (files = [], dest = './dist') {
  const promises = [];

  for (const file of files) {
    const absoluteDestPath = path.resolve(dest, file);
    const absoluteSrcPath = path.resolve(file);

    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    promises.push(promise);

    fs.copyFile(absoluteSrcPath, absoluteDestPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(file);
    });
  }

  return Promise.all(promises);
};
