import { createRequire } from "module";
import chalk from 'chalk';
import { createServer } from 'vite';
import {
  getViteConfigForSiteDev,
} from '../config/vite.site.js';
import { mergeCustomViteConfig } from '../common/index.js';

export default async function compileDocsSite(production = false) {
  if (production) {
    // build
  } else {
    const config = mergeCustomViteConfig(getViteConfigForSiteDev());
    const server = await createServer(config);
    await server.listen();

    const require = createRequire(import.meta.url);
    const { version } = require('vite/package.json');
    const viteInfo = chalk.cyan(`vite v${version}`);
    console.log(`\n  ${viteInfo}` + chalk.green(` dev server running at:\n`));
    server.printUrls();
  }
}