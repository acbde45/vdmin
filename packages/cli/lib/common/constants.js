import fse from "fs-extra";
import { createRequire } from "module";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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
