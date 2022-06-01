import fse from "fs-extra";
import { join } from "path";
import { loadConfigFromFile } from "vite";
import { ROOT, DOCS_DIR } from "./constants.js";
import { isDev } from "./environment.js";

const supportedConfigExtensions = ['js', 'ts', 'mjs', 'mts'];

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
    const command = isDev() ? 'server' : 'build';
    const mode = isDev() ? 'development' : 'production';
    const result = await loadConfigFromFile({ mode, command  }, configPath, ROOT);
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

export function mergeCustomDocsConfig(config) {
  const vdminDocsConfig = getVdminDocsConfig();
  const configureVite = vdminDocsConfig.build?.configureVite;

  if (configureVite) {
    return configureVite(config);
  }
  return config;
}
