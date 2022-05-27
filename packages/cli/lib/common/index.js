const { getVdminConfig } = require('./constants');

function setNodeEnv(value) {
  process.env.NODE_ENV = value;
}

function setBuildTarget(value) {
  process.env.BUILD_TARGET = value;
}

function isDev() {
  return process.env.NODE_ENV === 'development';
}

const camelizeRE = /-(\w)/g;
const pascalizeRE = /(\w)(\w*)/g;

function camelize(str) {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}

function pascalize(str) {
  return camelize(str).replace(
    pascalizeRE,
    (_, c1, c2) => c1.toUpperCase() + c2
  );
}

function decamelize(str, sep = '-') {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
    .replace(/([A-Z])([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
    .toLowerCase();
}

function normalizePath(path) {
  return path.replace(/\\/g, '/');
}

function mergeCustomViteConfig(config) {
  const vdminConfig = getVdminConfig();
  const configureVite = vdminConfig.build?.configureVite;

  if (configureVite) {
    return configureVite(config);
  }
  return config;
}

module.exports = {
  setNodeEnv,
  setBuildTarget,
  isDev,
  camelize,
  pascalize,
  decamelize,
  normalizePath,
  mergeCustomViteConfig,
  getVdminConfig,
};
