const { setNodeEnv } = require('../common/index');
const compileDocsSite = require('../compiler/compile-docs-site');

module.exports = async function docsDev() {
  setNodeEnv('development');
  await compileDocsSite();
}
