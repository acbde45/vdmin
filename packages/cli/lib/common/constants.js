import fse from "fs-extra";
import { join, dirname, isAbsolute } from "path";
import { fileURLToPath } from "url";
import { loadConfigFromFile } from "vite";

const supportedConfigExtensions = ['js', 'ts', 'mjs', 'mts'];

async function findRootDir(dir) {
  let configPath
  for (const ext of supportedConfigExtensions) {
    const p = join(dir, `vdmin.config.${ext}`)
    if (await fse.pathExists(p)) {
      configPath = p
      break
    }
  }
  if (configPath) {
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

async function getVdminConfigAsync() {
  try {
    // load user config
    let configPath
    for (const ext of supportedConfigExtensions) {
      const p = join(ROOT, `vdmin.config.${ext}`)
      if (await fse.pathExists(p)) {
        configPath = p
        break
      }
    }
    const result = await loadConfigFromFile({}, configPath, ROOT);
    return result.config;
  } catch (err) {
    return {};
  }
}

const vdminConfig = await getVdminConfigAsync();

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

  return join(ROOT, "src");
}

export const SRC_DIR = getSrcDir();
