import { join } from 'path';
import fse from 'fs-extra';
import { SRC_DIR } from '../common/constants.js';
import {
  pascalize,
  removeExt,
  decamelize,
  getVdminConfig,
  normalizePath,
} from '../common/index.js';

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
  const vdminConfig = getVdminConfig();
  const demoNames = demos.map((item) => decamelize(item.name));

  function demoFilter(nav) {
    return nav.filter((group) => {
      group.items = group.items.filter((item) =>
        demoNames.includes(item.path)
      );
      return group.items.length;
    });
  }

  const { nav } = vdminConfig.site;
  if (nav) {
    vdminConfig.site.nav = demoFilter(nav);
  }

  return `export const config = ${JSON.stringify(vdminConfig, null, 2)}`;
}

function genCode(components) {
  const demos = components
    .map((component) => ({
      component,
      name: pascalize(component),
      path: join(SRC_DIR, component, 'demo/index.vue'),
    }))
    .filter((item) => fse.existsSync(item.path));

  return `${genImports(demos)}

${genExports(demos)}
${genConfig(demos)}
`;
}

export default function genSiteMobileShared() {
  const dirs = fse.readdirSync(SRC_DIR);
  const code = genCode(dirs);

  return code;
}
