import Context from '../common/context.js';
import compileDocsSite from '../compiler/compile-docs-site.js';

export default async function docsDev(config) {
  const context = await new Context({
    ...config,
    mode: 'development',
    command: 'dev',
    docs: true,
    production: false
  });
  await compileDocsSite(context);
}
