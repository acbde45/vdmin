import { getVdminDocsConfig } from './constants.js';

export function setNodeEnv(value) {
  process.env.NODE_ENV = value;
}

export function setBuildTarget(value) {
  process.env.BUILD_TARGET = value;
}

export function isDev() {
  return process.env.NODE_ENV === 'development';
}

export function removeExt(path) {
  return path.replace('.js', '');
}

export const camelizeRE = /-(\w)/g;
export const pascalizeRE = /(\w)(\w*)/g;

export function camelize(str) {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}

export function pascalize(str) {
  return camelize(str).replace(
    pascalizeRE,
    (_, c1, c2) => c1.toUpperCase() + c2
  );
}

export function decamelize(str, sep = '-') {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
    .replace(/([A-Z])([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
    .toLowerCase();
}

export function normalizePath(path) {
  return path.replace(/\\/g, '/');
}

export function mergeCustomDocsConfig(config) {
  const vdminDocsConfig = getVdminDocsConfig();
  const configureVite = vdminDocsConfig.build?.configureVite;

  if (configureVite) {
    return configureVite(config);
  }
  return config;
}

export { getVdminDocsConfig };
