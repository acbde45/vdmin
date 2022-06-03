import { join } from 'path';
import fse from 'fs-extra';
import { pascalize, normalizePath } from '../common/utils.js';

function resolveDocuments(context) {
  const nav = context.config?.docs?.nav || [];

  const docs = [];

  nav.forEach((group) => {
    group.items.forEach((item) => {
      docs.push(
        {
          name: pascalize(item.path),
          path: join(context.docsDir, group.group, item.path, 'README.md'),
        },
        {
          name: pascalize(item.path),
          path: join(context.docsDir, group.group, item.path + '.md'),
        },
      );
    });
  });

  return [...docs.filter((item) => fse.existsSync(item.path))];
}

function genImportDocuments(context, items) {
  return items
    .map((item) => {
      const path = normalizePath(item.path);
      if (context.isDev()) {
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

function genVdminConfigContent(context) {
  const config = { site: { ...context.config.site, ...context.config.docs } };
  return 'const config = ' + JSON.stringify(config, null, 2);
}

function genExportConfig() {
  return 'export { config };';
}

function genExportVersion(context) {
  return `export const packageVersion = '${context.pkg.version}';`;
}

export default async function genSiteDesktopShared(context) {
  const documents = resolveDocuments(context);

  const code = `${genImportDocuments(context, documents)}

${genVdminConfigContent(context)}

${genExportConfig()}
${genExportDocuments(documents)}
${genExportVersion(context)}
`;

  return code;
}
