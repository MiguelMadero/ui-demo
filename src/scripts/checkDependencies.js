require('./checkEngines');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

var yarnLockFound = false;
var count = 0;
var currentDir = process.cwd();

module.exports = function checkDependencies() {
  while (!yarnLockFound && count < 10) {
    count += 1;
    try {
      const stats = fs.statSync(path.join(currentDir, 'yarn.lock'));
      yarnLockFound = stats.isFile();
    } catch (e) {}
    if (!yarnLockFound) {
      currentDir = path.join(currentDir, '..');
    }
  }

  if (!yarnLockFound) {
    throw new Error('yarn.lock is not found');
  }

  try {
    execSync('yarn run checkIntegrity', { cwd: currentDir });
  } catch (e) {
    console.log('\n\nDEPENDENCY CHECK FAILED\nPLEASE RUN lerna bootstrap\n');
    process.exit(1);
  }
};
