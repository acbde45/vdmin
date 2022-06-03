import { join, dirname } from 'path';
import { createRequire } from 'module';
import fse from 'fs-extra';
import { loadConfigFromFile, normalizePath } from 'vite';
import { supportedConfigExtensions } from "./constants.js";

export default class Content {
  command;
  mode;
  config;
  cwd;
  root;
  configPath;
  pkgPath;
  pkg;
  docs;
  cliOptions;

  docsDir;
  docsThemeDir;
  outDir;

  constructor(options) {
    const init = (async () => {
      const { docs, command, mode, configPath, cliOptions } = options;
      this.command = command;
      this.mode = mode;
      this.cliOptions = cliOptions;
      this.docs = docs;
      this.cwd = process.cwd();
      this.root = await this.findRootDir(this.cwd);
      this.pkgPath = normalizePath(join(this.root, 'package.json'));
      this.pkg = this.getPkg();
      this.configPath = normalizePath(join(this.cwd, configPath));

      this.config = await this.getConfig();

      this.docsDir = normalizePath(join(this.root, 'docs'));
      this.docsThemeDir = normalizePath(join(this.docsDir, 'theme'));
      this.outDir = normalizePath(join(this.root, 'dist'));

      // overrides 
      const docsConfig = this.config?.docs;
      const buildConfig = this.config?.build;
      if (docsConfig?.dir) {
        this.docsDir = normalizePath(join(dirname(this.configPath), docsConfig?.dir));
      }
      if (docsConfig?.themeDir) {
        this.docsThemeDir = normalizePath(join(dirname(this.configPath), docsConfig?.themeDir));
      }
      if (buildConfig?.outDir) {
        this.outDir = normalizePath(join(dirname(this.configPath), buildConfig?.outDir));
      }
      delete this.then;
      return this;
    })();
    this.then = init.then.bind(init);
  }

  async findRootDir(dir, cache) {
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

    return this.findRootDir(parentDir, cache);
  }

  async getPkg() {
    // TODO 更好的错误提示，检查是否为json格式
    const rawJson = await fse.readFile(this.pkgPath, 'utf-8');
    this.pkg = JSON.parse(rawJson);
  }

  async getConfig() {
    try {
      let configPath;

      if (this.configPath) {
        configPath = this.configPath;
      } else {
        for (const ext of supportedConfigExtensions) {
          const p = join(this.root, `vdmin.config.${ext}`)
          if (fse.pathExists(p)) {
            configPath = p
            break
          }
        }
      }

      const result = await loadConfigFromFile({
        mode: this.mode,
        command: this.command
      }, configPath, this.root);

      return result.config;
    } catch (err) {
      return {};
    }
  }

  mergeCustomViteConfig(viteConfig) {
    const configureVite = this.config?.build?.configureVite;

    if (configureVite) {
      return configureVite(viteConfig);
    }
    return viteConfig;
  }

  isDev() {
    return this.mode === 'development';
  }
}