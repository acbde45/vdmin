const chalk = require('chalk');
const { createServer } = require('vite');
const {
  getViteConfigForSiteDev,
} = require('../config/vite.site.js');
const { mergeCustomViteConfig } = require('../common/index.js');

module.exports = async function compileDocsSite(production = false) {
  if (production) {
    // build
  } else {
    const config = mergeCustomViteConfig(getViteConfigForSiteDev());
    const server = await createServer(config);
    await server.listen();

    const { version } = require('vite/package.json');
    const viteInfo = chalk.cyan(`vite v${version}`);
    console.log(`\n  ${viteInfo}` + chalk.green(` dev server running at:\n`));
    server.printUrls();
  }
}