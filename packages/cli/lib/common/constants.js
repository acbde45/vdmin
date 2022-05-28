import fse from "fs-extra";
import { createRequire } from "module";
import { join, dirname, isAbsolute } from "path";
import { fileURLToPath } from "url";
import { loadConfigFromFile } from "vite";

const supportedConfigExtensions = ['js', 'ts', 'mjs', 'mts'];

async function findRootDir(dir, cache) {
  const pkgPath = join(dir, `package.json`);
  if (await fse.pathExists(pkgPath)) {
    const require = createRequire(import.meta.url);
    const pkg = require(pkgPath);
    if (pkg) {
      cache = dir;
    }
    if (pkg.root) {
      return dir;
    }
  }

  const parentDir = dirname(dir);
  if (dir === parentDir) {
    return cache;
  }

  return findRootDir(parentDir, cache);
}

// Root paths
export const CWD = process.cwd();
export const ROOT = await findRootDir(CWD);
export const DOCS_DIR = join(ROOT, "docs");
export const THEME_DIR = join(DOCS_DIR, "theme");
export const PACKAGE_JSON_FILE = join(ROOT, "package.json");

// Relative paths
const __dirname = dirname(fileURLToPath(import.meta.url));
export const SITE_SRC_DIR = join(__dirname, "..", "..", "site");

export function getPackageJson() {
  const rawJson = fse.readFileSync(PACKAGE_JSON_FILE, "utf-8");
  return JSON.parse(rawJson);
}

async function getVdminDocsConfigAsync() {
  try {
    // load user config
    let configPath
    for (const ext of supportedConfigExtensions) {
      const p = join(DOCS_DIR, `config.${ext}`)
      if (await fse.pathExists(p)) {
        configPath = p
        break
      }
    }
    const result = await loadConfigFromFile({}, configPath, ROOT);
    return result.config;
  } catch (err) {
    console.log(err);
    return {};
  }
}

const vdminDocsConfig = await getVdminDocsConfigAsync();

export function getVdminDocsConfig() {
  return vdminDocsConfig;
}
