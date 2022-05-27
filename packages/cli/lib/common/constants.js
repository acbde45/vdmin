import fse from 'fs-extra';
import { join, dirname, isAbsolute } from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

function findRootDir(dir) {
  if (fse.existsSync(join(dir, 'vdmin.config.mjs'))) {
    return dir;
  }

  const parentDir = dirname(dir);
  if (dir === parentDir) {
    return dir;
  }

  return findRootDir(parentDir);
}

// Root paths
export const CWD = process.cwd();
export const ROOT = findRootDir(CWD);
export const DOCS_DIR = join(ROOT, 'docs');
export const VDMIN_CONFIG_FILE = join(ROOT, 'vdmin.config.mjs');
export const PACKAGE_JSON_FILE = join(ROOT, 'package.json');

// Relative paths
const __dirname = dirname(fileURLToPath(import.meta.url));
export const SITE_SRC_DIR = join(__dirname, '..', '..', 'site');

export function getPackageJson() {
  const rawJson = fse.readFileSync(PACKAGE_JSON_FILE, 'utf-8');
  return JSON.parse(rawJson);
}

async function getVantConfigAsync() {
  try {
    // https://github.com/nodejs/node/issues/31710
    // absolute file paths don't work on Windows
    return (await import(pathToFileURL(VDMIN_CONFIG_FILE).href)).default;
  }
  catch (err) {
    return {};
  }
}

const vdminConfig = await getVantConfigAsync();

export function getVdminConfig() {
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

export const SRC_DIR = getSrcDir();
