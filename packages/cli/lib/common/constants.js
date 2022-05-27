const { existsSync, readFileSync } = require('fs-extra');
const { join, dirname } = require('path');
const { pathToFileURL } = require('url');

function findRootDir(dir) {
  if (existsSync(join(dir, 'vdmin.config.mjs'))) {
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
const DOCS_DIR = join(ROOT, 'docs');
const VDMIN_CONFIG_FILE = join(ROOT, 'vdmin.config.mjs');
const PACKAGE_JSON_FILE = join(ROOT, 'package.json');

// Relative paths
const SITE_SRC_DIR = join(__dirname, '..', '..', 'site');

function getPackageJson() {
  const rawJson = readFileSync(PACKAGE_JSON_FILE, 'utf-8');
  return JSON.parse(rawJson);
}

async function getVantConfigAsync() {
  try {
      // https://github.com/nodejs/node/issues/31710
      // absolute file paths don't work on Windows
      return (await import(pathToFileURL(VANT_CONFIG_FILE).href)).default;
  }
  catch (err) {
      return {};
  }
}
let vdminConfig;
async function getVdminConfig() {
  if (!vdminConfig) {
    vdminConfig = await getVantConfigAsync();
  }
  return vdminConfig;
}

function getSrcDir() {
  const vantConfig = getVdminConfig();
  const srcDir = vantConfig.build?.srcDir;

  if (srcDir) {
    if (isAbsolute(srcDir)) {
      return srcDir;
    }

    return join(ROOT, srcDir);
  }

  return join(ROOT, 'src');
}

const SRC_DIR = getSrcDir();

module.exports = {
  CWD,
  ROOT,
  DOCS_DIR,
  PACKAGE_JSON_FILE,
  VDMIN_CONFIG_FILE,
  SITE_SRC_DIR,
  SRC_DIR,
  getPackageJson,
  getVdminConfig,
};