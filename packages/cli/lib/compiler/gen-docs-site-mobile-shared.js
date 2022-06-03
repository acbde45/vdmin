import { join } from 'path';
import fse from 'fs-extra';
import {
  pascalize,
  removeExt,
  normalizePath,
} from '../common/utils.js';

function genImports(demos) {
  return demos
    .map((item) => {
      const path = removeExt(normalizePath(item.path));
      return `const ${item.name} = () => import('${path}')`;
    })
    .join('\n');
}

function genExports(demos) {
  return `export const demos = {\n  ${demos
    .map((item) => item.name)
    .join(',\n  ')}\n};`;
}

function genConfig(context, demos) {
  const config = { site: { ...context.config.site, ...context.config.docs } };
  const demoNames = demos.map((item) => item.name);

  function demoFilter(nav) {
    return nav.filter((group) => {
      group.items = group.items.filter((item) =>
        demoNames.includes(pascalize(item.path))
      );
      return group.items.length;
    });
  }

  const { nav } = config.site;
  if (nav) {
    config.site.nav = demoFilter(nav);
  }

  return `export const config = ${JSON.stringify(config, null, 2)}`;
}

function genDemos(context) {
  const nav = context.config.docs?.nav || [];
  let demos = [];

  nav.forEach((group) => {
    group.items.forEach((item) => {
      demos.push(
        {
          component: item.path,
          name: pascalize(item.path),
          path: join(context.docsDir, group.group, item.path, 'demo/index.vue'),
        }
      );
    });
  });

  demos = [...demos.filter((item) => fse.existsSync(item.path))];

  return demos;
}

export default function genSiteMobileShared(context) {
  const demos = genDemos(context);

  return `${genImports(demos)}

  ${genExports(demos)}
  ${genConfig(context, demos)}
  `;;
}
