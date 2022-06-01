import { join } from 'path';
import fse from 'fs-extra';
import { DOCS_DIR } from '../common/constants.js';
import {
  pascalize,
  removeExt,
  decamelize,
  normalizePath,
} from '../common/utils.js';
import { getVdminDocsConfig } from '../common/resolve-config.js';

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

function genConfig(demos) {
  const docsConfig = getVdminDocsConfig();
  const demoNames = demos.map((item) => decamelize(item.name));

  function demoFilter(nav) {
    return nav.filter((group) => {
      group.items = group.items.filter((item) =>
        demoNames.includes(item.path)
      );
      return group.items.length;
    });
  }

  const { nav } = docsConfig.site;
  if (nav) {
    docsConfig.site.nav = demoFilter(nav);
  }

  return `export const config = ${JSON.stringify(docsConfig, null, 2)}`;
}

function genCode(nav) {
  let demos = [];

  nav.forEach((group) => {
    group.items.forEach((item) => {
      demos.push(
        {
          component: item.path,
          name: pascalize(item.path),
          path: join(DOCS_DIR, group.group, item.path, 'demo/index.vue'),
        },
      );
    });
  });

  demos = [...demos.filter((item) => fse.existsSync(item.path))];

  return `${genImports(demos)}

${genExports(demos)}
${genConfig(demos)}
`;
}

export default function genSiteMobileShared() {
  const docsConfig = getVdminDocsConfig();
  const code = genCode(docsConfig.site?.nav || []);

  return code;
}
