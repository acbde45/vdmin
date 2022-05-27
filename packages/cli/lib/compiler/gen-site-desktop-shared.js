import { join } from 'path';
import fse from 'fs-extra';
import {
  isDev,
  pascalize,
  normalizePath,
} from '../common/index.js';
import {
  DOCS_DIR,
  getPackageJson,
  getVdminConfig,
  VDMIN_CONFIG_FILE,
} from '../common/constants.js';

function formatName(component) {
  component = pascalize(component);

  return component;
}

function resolveDocuments(nav) {
  const docs = [];

  nav.forEach(group => {
    group.items.forEach(item => {
      docs.push({
        name: formatName(item.path),
        path: join(DOCS_DIR, group, item.path, 'README.md'),
      }, {
        name: formatName(item.path),
        path: join(DOCS_DIR, group, item.path + '.md'),
      });
    });
  });

  return [...docs.filter((item) => fse.existsSync(item.path))];

  // components.forEach((component) => {
  //   docs.push({
  //     name: formatName(component),
  //     path: join(DOCS_DIR, component, 'README.md'),
  //   });
  // });

  // const staticDocs = globby
  //   .sync(normalizePath(join(DOCS_DIR, '**/*.md')))
  //   .map((path) => {
  //     const name = parse(path).name;
  //     return {
  //       name: formatName(name),
  //       path,
  //     };
  //   });

  // return [...staticDocs, ...docs.filter((item) => fse.existsSync(item.path))];
}

function genImportDocuments(items) {
  return items
    .map((item) => {
      const path = normalizePath(item.path);
      if (isDev()) {
        return `const ${item.name} = () => import('${path}');`;
      }
      return `import ${item.name} from '${path}';`;
    })
    .join('\n');
}

function genExportDocuments(items) {
  return `export const documents = {
  ${items.map((item) => item.name).join(',\n  ')}
};`;
}

function genVantConfigContent() {
  const content = fse.readFileSync(VDMIN_CONFIG_FILE, 'utf-8');
  return content.replace('module.exports =', 'const config =');
}

function genExportConfig() {
  return 'export { config };';
}

function genExportVersion() {
  return `export const packageVersion = '${getPackageJson().version}';`;
}

export default async function genSiteDesktopShared() {
  const vdminConfig = await getVdminConfig();
  const documents = resolveDocuments(vdminConfig.site?.nav || []);

  console.log(vdminConfig);
  console.log(documents);

  const code = `${genImportDocuments(documents)}

${genVantConfigContent()}

${genExportConfig()}
${genExportDocuments(documents)}
${genExportVersion()}
`;

  return code;
}
