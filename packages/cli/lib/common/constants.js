import { join, dirname } from "path";
import { fileURLToPath } from "url";

export const supportedConfigExtensions = Object.freeze(['js', 'ts', 'mjs', 'mts']);

// Relative paths
const __dirname = dirname(fileURLToPath(import.meta.url));
export const SITE_SRC_DIR = join(__dirname, "..", "..", "site");
