const { existsSync } = require('fs-extra');
const { join, dirname } = require('path');

function findRootDir(dir) {
  if (existsSync(join(dir, 'vdmin.config.js'))) {
    return dir;
  }

  const parentDir = dirname(dir);
  if (dir === parentDir) {
    return dir;
  }

  return findRootDir(parentDir);
}

// Root paths
const CWD = process.cwd();
const ROOT = findRootDir(CWD);
const VDMIN_CONFIG_FILE = join(ROOT, 'vdmin.config.js');

// Relative paths
const SITE_SRC_DIR = join(__dirname, '..', '..', 'site');

let vdminConfig;
function getVdminConfig() {
  if (!vdminConfig) {
    vdminConfig = require(VDMIN_CONFIG_FILE);
  }
  return vdminConfig;
}

module.exports = {
  CWD,
  ROOT,
  VDMIN_CONFIG_FILE,
  SITE_SRC_DIR,
  getVdminConfig,
};