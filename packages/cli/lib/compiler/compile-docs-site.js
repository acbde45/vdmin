import { createRequire } from "module";
import chalk from 'chalk';
import { createServer } from 'vite';
import {
  getViteConfigForDocsSiteDev,
} from '../config/vite.docs-site.js';

export default async function compileDocsSite(context) {
  if (context.isDev()) {
    const config = getViteConfigForDocsSiteDev(context);
    const server = await createServer(config);
    await server.listen();

    const require = createRequire(import.meta.url);
    const { version } = require('vite/package.json');
    const viteInfo = chalk.cyan(`vite v${version}`);
    console.log(`\n  ${viteInfo}` + chalk.green(` dev server running at:\n`));
    server.printUrls();
  } else {
    // build
  }
}