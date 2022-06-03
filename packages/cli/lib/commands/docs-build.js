import Context from '../common/context.js';
import compileDocsSite from '../compiler/compile-docs-site.js';

export default async function docsDev(config) {
  const context = await new Context({
    ...config,
    mode: 'production',
    command: 'build',
    docs: true,
    production: true
  });
  await compileDocsSite(context);
}
