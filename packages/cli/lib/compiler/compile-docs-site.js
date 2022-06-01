import { createRequire } from "module";
import chalk from 'chalk';
import { createServer } from 'vite';
import {
  getDocsConfigForSiteDev,
} from '../config/vite.docs-site.js';
import { mergeCustomDocsConfig } from '../common/resolve-config.js';

export default async function compileDocsSite(production = false) {
  if (production) {
    // build
  } else {
    const config = mergeCustomDocsConfig(getDocsConfigForSiteDev());
    const server = await createServer(config);
    await server.listen();

    const require = createRequire(import.meta.url);
    const { version } = require('vite/package.json');
    const viteInfo = chalk.cyan(`vite v${version}`);
    console.log(`\n  ${viteInfo}` + chalk.green(` dev server running at:\n`));
    server.printUrls();
  }
}