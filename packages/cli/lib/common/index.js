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

function mergeCustomViteConfig(config) {
  const vantConfig = getVdminConfig();
  const configureVite = vantConfig.build?.configureVite;

  if (configureVite) {
    return configureVite(config);
  }
  return config;
}

module.exports = {
  setNodeEnv,
  setBuildTarget,
  isDev,
  mergeCustomViteConfig,
  getVdminConfig,
};
