import { setNodeEnv } from '../common/environment.js';
import compileDocsSite from '../compiler/compile-docs-site.js';

export default async function docsDev() {
  setNodeEnv('development');
  await compileDocsSite();
}
