import { join } from 'path';
import fse from 'fs-extra';
import { pascalize, normalizePath } from '../common/utils.js';
import { DOCS_DIR } from '../common/constants.js';
import { getPackageJson, isDev } from '../common/environment.js';
import { getVdminDocsConfig } from '../common/resolve-config.js';

function formatName(component) {
  component = pascalize(component);

  return component;
}

function resolveDocuments(nav) {
  const docs = [];

  nav.forEach((group) => {
    group.items.forEach((item) => {
      docs.push(
        {
          name: formatName(item.path),
          path: join(DOCS_DIR, group.group, item.path, 'README.md'),
        },
        {
          name: formatName(item.path),
          path: join(DOCS_DIR, group.group, item.path + '.md'),
        }
      );
    });
  });

  return [...docs.filter((item) => fse.existsSync(item.path))];
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
  const content = getVdminDocsConfig();
  return 'const config = ' + JSON.stringify(content, null, 2);
}

function genExportConfig() {
  return 'export { config };';
}

function genExportVersion() {
  return `export const packageVersion = '${getPackageJson().version}';`;
}

export default async function genSiteDesktopShared() {
  const docsConfig = await getVdminDocsConfig();
  const documents = resolveDocuments(docsConfig.site?.nav || []);

  const code = `${genImportDocuments(documents)}

${genVantConfigContent()}

${genExportConfig()}
${genExportDocuments(documents)}
${genExportVersion()}
`;

  return code;
}
