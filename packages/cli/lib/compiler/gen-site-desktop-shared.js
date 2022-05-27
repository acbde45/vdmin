const globby = require('globby');
const { join, parse } = require('path');
const { existsSync, readFileSync, readdirSync } = require('fs-extra');
const {
  isDev,
  pascalize,
  normalizePath,
} = require('../common/index');
const {
  SRC_DIR,
  DOCS_DIR,
  getPackageJson,
  VDMIN_CONFIG_FILE,
} = require('../common/constants');
const { dir } = require('console');

function formatName(component) {
  component = pascalize(component);

  return component;
}

function resolveDocuments(components) {
  const docs = [];

  components.forEach((component) => {
    docs.push({
      name: formatName(component),
      path: join(DOCS_DIR, component, 'README.md'),
    });
  });

  const staticDocs = globby
    .sync(normalizePath(join(DOCS_DIR, '**/*.md')))
    .map((path) => {
      const name = parse(path).name;
      return {
        name: formatName(name),
        path,
      };
    });

  return [...staticDocs, ...docs.filter((item) => existsSync(item.path))];
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
  const content = readFileSync(VDMIN_CONFIG_FILE, 'utf-8');
  return content.replace('module.exports =', 'const config =');
}

function genExportConfig() {
  return 'export { config };';
}

function genExportVersion() {
  return `export const packageVersion = '${getPackageJson().version}';`;
}

function genSiteDesktopShared() {
  const dirs = readdirSync(SRC_DIR);
  const documents = resolveDocuments(dirs);

  const code = `${genImportDocuments(documents)}

${genVantConfigContent()}

${genExportConfig()}
${genExportDocuments(documents)}
${genExportVersion()}
`;

  return code;
}

module.exports = genSiteDesktopShared;
